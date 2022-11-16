import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestCrawlerModule } from 'nest-crawler';
import { BullModule } from '@nestjs/bull';
import { APP_GUARD } from '@nestjs/core';

import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService, PrismaServiceOld } from 'prisma/prisma.service';

import { configuration } from 'config/configuration';
import { validationSchema } from 'config/env.validation';

import { AppService } from 'src/modules/app/app.service';
import { AppController } from 'src/modules/app/app.controller';
import { UserModule } from 'src/modules/user/user.module';
import { ProfileModule } from 'src/modules/profile/profile.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PlanModule } from 'src/modules/plan/plan.module';
import { SimsModule } from 'src/modules/sims/sims.module';
import { DataChargeModule } from 'src/modules/data-charge/data-charge.module';
import { DataTrafficModule } from 'src/modules/data-traffic/data-traffic.module';
import { LineModule } from 'src/modules/line/line.module';
import { MailModule } from 'src/modules/mail/mail.module';
import { UserService } from 'src/modules/user/user.service';
import { TaskModule } from 'src/modules/task/task.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    NestCrawlerModule,
    UserModule,
    ProfileModule,
    PlanModule,
    SimsModule,
    DataChargeModule,
    DataTrafficModule,
    MailModule,
    TaskModule,
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV}`,
      load: [configuration],
      isGlobal: true,
      validationSchema,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('redis.host'),
          port: Number(configService.get<number>('redis.port')),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'mailing',
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    LineModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, PrismaServiceOld, UserService],
  exports: [],
})
export class AppModule {}
