import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import aws, { SES } from 'aws-sdk';
import { join } from 'path';

import { PrismaService, PrismaServiceOld } from 'prisma/prisma.service';
import { MailingConsumer } from 'src/modules/mail/mail.processor';
import { MailService } from 'src/modules/mail/mail.service';
import { UserService } from 'src/modules/user/user.service';
import { LineService } from 'src/modules/line/line.service';
import { SimsService } from 'src/modules/sims/sims.service';
import { ProfileService } from 'src/modules/profile/profile.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          // aws ses configuration
          SES: new SES({
            region: configService.get<string>('mail.aws_region'),
            accessKeyId: configService.get<string>(
              'mail.aws_ses_access_key_id',
            ),
            secretAccessKey: configService.get<string>(
              'mail.aws_ses_secret_access_key',
            ),
          }),
          aws,
        },
        defaults: {
          from: '"no-reply" <b.baasansuren@gtn.co.jp>',
        },
        template: {
          dir: join(
            '/Users/bilguunbaasansuren/Documents/gtn/gtn-mobile-nest/backend/src/modules/mail',
            'templates',
          ),
          // dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
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
  ],
  providers: [
    MailService,
    MailingConsumer,
    PrismaService,
    PrismaServiceOld,
    UserService,
    LineService,
    SimsService,
    ProfileService,
  ],
  exports: [MailService],
})
export class MailModule {}
