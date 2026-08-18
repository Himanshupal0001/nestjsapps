import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './users.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUsers.dto';
import { CreateUserResponseDto } from './dto/createUserResponse.dto';

@ApiBearerAuth('authorization')
@ApiTags('user')
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: CreateUserDto,
    description: 'User create body',
  })
  @ApiOkResponse({
    type: CreateUserResponseDto,
    description: '',
  })
  @ApiOperation({ description: 'user created successfuly' })
  @ApiConsumes('application/json')
  @Post('signup')
  async login(@Body() dto: CreateUserDto): Promise<CreateUserResponseDto> {
    return await this.userService.createUser(dto);
  }
}
