import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestCrawlerModule } from 'nest-crawler';
import { BullModule } from '@nestjs/bull';

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
import { SimsModule } from 'src/modules/sims/sims.module';
import { DataChargeModule } from 'src/modules/data-charge/data-charge.module';
import { DataTrafficModule } from 'src/modules/data-traffic/data-traffic.module';
import { LineModule } from '../line/line.module';
import { MailModule } from '../mail/mail.module';

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
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env`,
      load: [configuration],
      isGlobal: true,
      validationSchema,
    }),
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: 'localhost',
          port: 6379,
        },
      }),
    }),
    // BullModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     redis: {
    //       host: 'localhost',
    //       port: 6379,
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
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
  providers: [AppService, PrismaService],
  exports: [],
})
export class AppModule {}
