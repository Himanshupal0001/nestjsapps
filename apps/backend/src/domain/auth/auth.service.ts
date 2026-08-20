import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../users/users.service';
import { SignInDto } from './dto/signIn.dto';
import bcrypt from 'bcrypt';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService, ConfigType } from '@nestjs/config';
import {
  AuthenticatedRefreshUserI,
  AuthTokensI,
  JwtPayloadI,
} from './common/types';
import { UserEntity } from '../users/entities/users.entity';
import refreshJwtConfig from 'src/config/jwt/refresh.jwt.config';
import { Response } from 'express';
import { REFRESH_COOKIE, REFRESH_TTL_SEC } from './common/contant';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async SignIn(dto: SignInDto, res: Response): Promise<AuthTokensI> {
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

    const payload: JwtPayloadI = { sub: user.id, email: user.email };
    const accessToken = this.signAccessToken(payload);
    const refreshToken = this.signRefreshToken(payload);

    try {
      await this.userService.updateRefreshToken(user.id, refreshToken);
    } catch (err) {
      this.logger.error(err);
      throw new UnauthorizedException('Invalid user');
    }

    this.setRefreshCookie(res, refreshToken);
    this.logger.log('User Signed in successfuly');

    return {
      status: true,
      message: 'User Signed in Successfuly',
      payload,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Called by JwtRefreshStrategy once the cookie's signature has been verified.
   * Confirms the token is still the one on record, which catches reuse of a
   * rotated-out token.
   */
  async validateRefreshToken(
    payload: JwtPayloadI,
    refreshToken: string,
  ): Promise<UserEntity> {
    const user = await this.userService.getUserById(payload.sub);

    if (!user || user.refreshToken !== refreshToken) {
      this.logger.warn(`Refresh token reuse attempt for user ${payload.sub}`);
      throw new UnauthorizedException('Refresh token is no longer valid');
    }

    return user;
  }

  async rotateRefreshToken(
    user: AuthenticatedRefreshUserI,
    res: Response,
  ): Promise<AuthTokensI> {
    const payload: JwtPayloadI = { sub: user.id, email: user.email };
    const accessToken = this.signAccessToken(payload);
    const refreshToken = this.signRefreshToken(payload);

    await this.userService.updateRefreshToken(user.id, refreshToken);
    this.setRefreshCookie(res, refreshToken);

    return {
      status: true,
      message: 'Token refreshed successfuly',
      payload,
      accessToken,
      refreshToken,
    };
  }

  async validateJwtPayload(payload: JwtPayloadI) {
    return await this.userService.findOneByEmail(payload.email);
  }

  async comparePassword(password: string, userPassword: string) {
    return await bcrypt.compare(password, userPassword);
  }

  private signAccessToken(payload: JwtPayloadI): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: this.configService.getOrThrow<string>(
        'JWT_ACCESS_EXPIRES',
      ) as JwtSignOptions['expiresIn'],
    });
  }

  private signRefreshToken(payload: JwtPayloadI): string {
    return this.jwtService.sign(payload, this.refreshTokenConfig);
  }

  setRefreshCookie(res: Response, refreshToken: string) {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: REFRESH_TTL_SEC * 1000,
    });
  }
}
