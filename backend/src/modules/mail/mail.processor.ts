import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueFailed,
  OnQueueError,
  OnQueueCompleted,
} from '@nestjs/bull';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/modules/mail/mail.service';

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
  }
  @Process('suspend-line')
  async sendSuspendLine(job: Job) {
    const { profile, sim } = job.data;
    const mailData = {
      to: `${this.configService.get<string>('mail.from_mail')}`,
      context: {
        title: '【GTN Mobile】回線停止の申込がありました',
        happiness_id: sim.happiness_id,
        name: profile.name,
        birthday: new Date(profile.birthday),
        email: profile.email,
      },
    };
    await this.mailService.sendSuspendLine(mailData);
  }

  @Process('restart-line')
  async sendRestartLine(job: Job) {
    const { profile, sim } = job.data;
    const mailData = {
      to: `${this.configService.get<string>('mail.from_mail')}`,
      context: {
        title: '【GTN Mobile】回線再開の申込がありました',
        happiness_id: sim.happiness_id,
        name: profile.name,
        birthday: new Date(profile.birthday),
        email: profile.email,
      },
    };
    await this.mailService.sendRestartLine(mailData);
  }
}
