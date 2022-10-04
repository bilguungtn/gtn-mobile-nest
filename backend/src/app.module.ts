import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { NestCrawlerModule } from 'nest-crawler';

import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';

import { configuration } from 'config/configuration';
import { validationSchema } from 'config/env.validation';

import { AppService } from 'src/app.service';
import { AppController } from 'src/app.controller';
import { UserModule } from 'src/user/user.module';
import { ProfileModule } from 'src/profile/profile.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    NestCrawlerModule,
    UserModule,
    ProfileModule,
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env`,
      load: [configuration],
      isGlobal: true,
      validationSchema,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [],
})
export class AppModule {}
