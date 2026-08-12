import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './users.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUsers.dto';

@ApiBearerAuth('authorization')
@ApiTags('user api')
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async login(@Body() dto: CreateUserDto) {
    return await this.userService.createUser(dto);
  }
}
