import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';

import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';
import { UserModule } from 'src/modules/user/user.module';
import { UserService } from 'src/modules/user/user.service';
import { BasicStrategy } from 'src/modules/auth/strategies/basic-auth.strategy';
import { ProfileService } from 'src/modules/profile/profile.service';

@Module({
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
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    BasicStrategy,
    JwtStrategy,
    UserService,
    ProfileService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
