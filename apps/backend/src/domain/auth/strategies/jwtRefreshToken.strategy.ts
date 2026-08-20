import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, JwtFromRequestFunction } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { AuthenticatedRefreshUserI, JwtPayloadI } from '../common/types';
import { REFRESH_COOKIE } from '../common/contant';

const refreshTokenFromCookie: JwtFromRequestFunction<Request> = (req) =>
  (req?.cookies?.[REFRESH_COOKIE] as string | undefined) ?? null;

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors<Request>([
        refreshTokenFromCookie,
      ]),
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: JwtPayloadI,
  ): Promise<AuthenticatedRefreshUserI> {
    const refreshToken = refreshTokenFromCookie(req);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const user = await this.authService.validateRefreshToken(
      payload,
      refreshToken,
    );

    return { ...user, refreshToken };
  }
}
