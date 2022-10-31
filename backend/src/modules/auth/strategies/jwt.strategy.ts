import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { ProfileService } from 'src/modules/profile/profile.service';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),

      // secretOrKeyProvider: passportJwtSecret({
      //   cache: true,
      //   rateLimit: true,
      //   jwksRequestsPerMinute: 5,
      //   jwksUri: `${configService.get<string>(
      //     'auth0_issuer_url',
      //   )}/.well-known/jwks.json`,
      // }),
      // audience: configService.get<string>('auth0_audience'),
      // issuer: configService.get<string>('auth0_issuer_url'),
      // algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload);
    const profile = await this.profileService.findByEmailAddress(user.email);
    return profile;
  }
}
