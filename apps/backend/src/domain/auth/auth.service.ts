import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../users/users.service';
import { SignInDto } from './dto/signIn.dto';
import bcrypt from 'bcrypt';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async SignIn(dto: SignInDto) {
    const { email, password } = dto;

    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('Email doest not exist');
    }

    const isMatch = await this.comparePassword(password, user.password);

    if (!isMatch) {
      this.logger.warn(`Failed sign in attempt for ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: this.configService.getOrThrow<string>(
        'JWT_ACCESS_EXPIRES',
      ) as JwtSignOptions['expiresIn'],
    });

    const refeshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.getOrThrow<string>(
        'JWT_REFRESH_EXPIRES',
      ) as JwtSignOptions['expiresIn'],
    });

    try {
      await this.userService.updateRefreshToken(user.id, refeshToken);
      this.logger.log('User Signed in successfuly');
      return {
        payload,
        accessToken,
        refeshToken,
      };
    } catch (err) {
      this.logger.error(err);
      throw new UnauthorizedException('Invalid user');
    }
  }

  async comparePassword(password: string, userPassword: string) {
    return await bcrypt.compare(password, userPassword);
  }
}
