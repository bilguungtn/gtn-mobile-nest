import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueFailed,
  OnQueueError,
  OnQueueCompleted,
} from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import { MailService } from './mail.service';

@Processor('mailing')
export class MailingConsumer {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  /** Job listeners */
  @OnQueueActive()
  onActive(job: Job) {
    console.log(`Processng job ${job.name}.`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log('job finished');
  }

  @OnQueueError()
  onError(err: Error) {
    console.log(`Error job.`, err);
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    console.log(`Failed job ${job.name}.`);
    // console.dir(job, { depth: null });
  }
  @Process('suspend-line')
  async sendSuspendLine(job: Job) {
    const mailData = {
      to: `${this.configService.get<string>('mail.from_mail')}`,
      context: {
        title: 'title',
      },
    };
    await this.mailService.sendSuspendLine(mailData);
  }
}
