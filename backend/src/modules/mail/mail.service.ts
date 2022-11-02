import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Send email. Application form complete.
   * @param {any} param0
   */
  sendSuspendLine = async ({ to, context }: any) => {
    await this.mailerService.sendMail({
      to,
      subject: context.title,
      template: './suspend-line-requested',
      context,
    });
  };
}
