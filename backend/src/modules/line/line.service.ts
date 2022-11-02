import { InjectQueue } from '@nestjs/bull';
import { HttpException, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { ProfileService } from 'src/modules/profile/profile.service';
import { SimsService } from 'src/modules/sims/sims.service';

@Injectable()
export class LineService {
  constructor(
    private readonly simsService: SimsService,
    private readonly profileService: ProfileService,
    @InjectQueue('mailing') private readonly mailingQueue: Queue,
  ) {}

  public async SuspendLine(data: any): Promise<any> {
    try {
      const { id, phoneNumber } = data;
      const sim = await this.simsService.findBySimNumberAndProfileId(
        id,
        phoneNumber,
      );
      if (!sim) throw new HttpException('error', 400);
      const profile = await this.profileService.getProfileWithSim(id);
      await this.mailingQueue.add('suspend-line', { profile, sim });
      return 'email sent';
    } catch (err) {
      throw err;
    }
  }
}
