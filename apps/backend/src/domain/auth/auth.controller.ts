import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignInDto } from './dto/signIn.dto';

@ApiBearerAuth('authorization')
@ApiTags('auth api')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('application/json')
  @ApiNotFoundResponse({ description: 'NOT FOUND' })
  @ApiForbiddenResponse({ description: 'FORBIDDEN REQUEST' })
  @ApiUnauthorizedResponse({ description: 'UNAUTHORIZED REQUEST' })
  @ApiBadRequestResponse({ description: 'INVALID REQUEST' })
  @ApiOkResponse({ description: 'ACCESS GRANTED' })
  @ApiOperation({ description: 'GRANT ACCESS' })
  @Post('signin')
  async login(@Body() dto: SignInDto) {
    return await this.authService.SignIn(dto);
  }
}
