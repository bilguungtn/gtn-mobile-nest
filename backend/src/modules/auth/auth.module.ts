import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';

import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';
import { UserModule } from 'src/modules/user/user.module';
import { UserService } from 'src/modules/user/user.service';
import { BasicStrategy } from 'src/modules/auth/strategies/basic-auth.strategy';
import { ProfileService } from 'src/modules/profile/profile.service';
import { JwtModule } from '@nestjs/jwt';

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
    BasicStrategy,
    JwtStrategy,
    UserService,
    ProfileService,
  ],
  exports: [PassportModule],
})
export class AuthModule {}
