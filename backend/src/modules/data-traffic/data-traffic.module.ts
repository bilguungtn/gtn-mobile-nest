import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { DataTrafficService } from './data-traffic.service';
import { DataTrafficController } from './data-traffic.controller';
import { PlanService } from 'src/modules/plan/plan.service';
import { PrismaService, PrismaServiceOld } from 'prisma/prisma.service';
import { ProfileService } from 'src/modules/profile/profile.service';
import { SimsService } from 'src/modules/sims/sims.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mailing',
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
  ],
  providers: [
    DataTrafficService,
    PrismaService,
    ProfileService,
    PlanService,
    PrismaServiceOld,
    SimsService,
    UserService,
  ],
  controllers: [DataTrafficController],
})
export class DataTrafficModule {}
