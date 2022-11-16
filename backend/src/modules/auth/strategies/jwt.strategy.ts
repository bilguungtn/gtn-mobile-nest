import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';
import { JwtPayloadDto } from '../dto/payload.dto';
import { AuthService } from '../auth.service';
import { TokenResponseDto } from '../dto/response/tokenResponse.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AUTH0_ISSUER_URL}.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get<string>('auth0_audience'),
      issuer: configService.get<string>('auth0_issuer_url'),
    });
  }

  /**
   * JWT Auth validation.
   * @param {JwtPayloadDto} payload
   * @returns
   */
  async validate(payload: JwtPayloadDto): Promise<TokenResponseDto> {
    const gtn_id = await this.authService.validateToken(payload);
    if (!gtn_id) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return gtn_id;
  }
}
