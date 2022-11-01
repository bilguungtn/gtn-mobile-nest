import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class LineService {
  constructor(@InjectQueue('mailing') private readonly mailingQueue: Queue) {}

  public async SuspendLine(data: any): Promise<any> {
    try {
      await this.mailingQueue.add('suspend-line', data);
      return 'email sent';
    } catch (err) {
      throw err;
    }
  }
}
