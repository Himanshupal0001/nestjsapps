import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignInDto } from './dto/signIn.dto';
import { Request, Response } from 'express';
import { AuthenticatedRefreshUserI, AuthTokensI } from './common/types';
import { REFRESH_COOKIE } from './common/contant';
import { RefreshTokenGuard } from './guards/refresh.token.guard';

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
  async login(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthTokensI> {
    return await this.authService.SignIn(dto, res);
  }

  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth(REFRESH_COOKIE)
  @ApiUnauthorizedResponse({ description: 'UNAUTHORIZED REQUEST' })
  @ApiOkResponse({ description: 'TOKEN REFRESHED' })
  @ApiOperation({
    summary: 'REFRESH ACCESS TOKEN',
    description:
      'Reads the refresh_token http-only cookie, rotates it and returns a new access token',
  })
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthTokensI> {
    return await this.authService.rotateRefreshToken(
      req.user as AuthenticatedRefreshUserI,
      res,
    );
  }
}
