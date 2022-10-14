import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { NestCrawlerModule } from 'nest-crawler';

import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';

import { configuration } from 'config/configuration';
import { validationSchema } from 'config/env.validation';

import { AppService } from 'src/modules/app/app.service';
import { AppController } from 'src/modules/app/app.controller';
import { UserModule } from 'src/modules/user/user.module';
import { ProfileModule } from 'src/modules/profile/profile.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { PlanModule } from 'src/modules/plan/plan.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    NestCrawlerModule,
    UserModule,
    ProfileModule,
    PlanModule,
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
  providers: [
    AppService,
    PrismaService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
  exports: [],
})
export class AppModule {}
