import { UserEntity } from 'src/domain/users/entities/users.entity';

export interface JwtPayloadI {
  sub: number;
  email: string;
}

export interface AuthTokensI {
  status: boolean;
  message: string;
  payload: JwtPayloadI;
  accessToken: string;
  refreshToken: string;
}

/**
 * Shape attached to `req.user` by JwtRefreshStrategy: the resolved user plus
 * the raw refresh token that was presented in the cookie.
 */
export interface AuthenticatedRefreshUserI extends UserEntity {
  refreshToken: string;
}
