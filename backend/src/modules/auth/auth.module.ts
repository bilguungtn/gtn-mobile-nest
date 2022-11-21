import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService, PrismaServiceOld } from 'prisma/prisma.service';

import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';
import { UserModule } from 'src/modules/user/user.module';
import { UserService } from 'src/modules/user/user.service';
import { ProfileService } from 'src/modules/profile/profile.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/modules/auth/auth.service';
import { SimsService } from 'src/modules/sims/sims.service';

@Module({
  // imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    PrismaService,
    PrismaServiceOld,
    JwtStrategy,
    UserService,
    ProfileService,
    AuthService,
    SimsService,
  ],
  exports: [PassportModule],
})
export class AuthModule {}
