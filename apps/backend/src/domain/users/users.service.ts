import { Logger, Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/users.entity';
import { Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUsers.dto';
import * as bcrypt from 'bcrypt';
import { FindUserByPropertyDto } from './dto/findUserPropery';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const userEntity = this.userRepository.create();
    const { name, email, password } = dto;

    const existingUser = await this.findOneByEmail(email.toLowerCase());

    if (existingUser) {
      throw new ConflictException(
        'Email already exist, you cannot create user with same email',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const saveEntity = {
      ...userEntity,
      ...dto,
      password: hashedPassword,
      name,
      email,
      status: true,
    };

    let user: UserEntity | null;

    try {
      user = await this.userRepository.save(saveEntity);
      this.logger.log(`User created successfuly ${JSON.stringify(user)}`);
      return user;
    } catch (err) {
      this.logger.error(err);
      throw new ConflictException('user already exist with the same email');
    }
  }

  async deleteUser(id: number) {
    return await this.userRepository.delete(id);
  }

  async getAllUsers() {
    return await this.userRepository.find({});
  }

  async findUserByEmail(
    dto: FindUserByPropertyDto,
  ): Promise<UserEntity | null> {
    const { email } = dto;

    const user = await this.userRepository.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });

    return user;
  }

  async findUserByPropery(dto: FindUserByPropertyDto) {
    const { name, email } = dto;

    const users = await this.userRepository.find({
      where: [{ name: Like(`%${name}%`) }, { email: Like(`%${email}%`) }],
    });

    return users;
  }

  async updateRefreshToken(id: number, token: string) {
    return this.userRepository.update(id, {
      refreshToken: token,
    });
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async getUserById(id: number): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }
}
