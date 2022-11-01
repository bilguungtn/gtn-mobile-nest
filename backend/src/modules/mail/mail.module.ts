import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { UserService } from '../user/user.service';
import { MailingConsumer } from './mail.processor';
import { MailService } from './mail.service';
import aws, { SES } from 'aws-sdk';
import { PrismaService } from 'prisma/prisma.service';
import { LineService } from '../line/line.service';
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
        // template: {
        //   dir: join(
        //     '/Users/bilguunbaasansuren/Documents/gtn/gtn-mobile-nest/backend/src/modules/mail',
        //     'templates',
        //   ),
        //   adapter: new HandlebarsAdapter(),
        //   options: {
        //     strict: true,
        //   },
        // },
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
    UserService,
    LineService,
  ],
  exports: [MailService],
})
export class MailModule {}
