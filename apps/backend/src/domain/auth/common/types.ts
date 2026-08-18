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
