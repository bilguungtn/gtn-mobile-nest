import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  getHello(): string {
    return 'Hello World!';
  }
  // @Cron(CronExpression.EVERY_SECOND)
  // triggerMessage() {
  //   console.log('Triggering Message Sending');
  // }
}
