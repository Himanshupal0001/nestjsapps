import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './users.service';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUsers.dto';
import { CreateUserResponseDto } from './dto/createUserResponse.dto';
import { AccessTokenGuard } from '../auth/guards/access.token.guard';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@ApiBearerAuth('authorization')
@ApiTags('user')
@Controller('user')
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

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: CreateUserResponseDto,
    description: 'User Profile',
  })
  @ApiOperation({ description: 'Get user profile' })
  @ApiConsumes('application/json')
  @Get('profile/:id')
  async getProfile(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getUserById(id);
  }

  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({
    type: CreateUserResponseDto,
    description: 'Get all users',
  })
  @ApiOperation({ description: 'Get all paginated users' })
  @ApiConsumes('application/json')
  @Get('all')
  async getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<CreateUserResponseDto>> {
    const options: IPaginationOptions = {
      limit,
      page,
    };

    return await this.userService.paginate(options);
  }
}
