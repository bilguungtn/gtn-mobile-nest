import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PrismaService, PrismaServiceOld } from 'prisma/prisma.service';
import { PlanModule } from '../plan/plan.module';
import { PlanService } from '../plan/plan.service';
import { ProfileService } from '../profile/profile.service';
import { SimsService } from '../sims/sims.service';
import { UserService } from '../user/user.service';
import { DataChargeController } from './data-charge.controller';
import { DataChargeService } from './data-charge.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mailing',
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
    PlanModule,
  ],
  controllers: [DataChargeController],
  providers: [
    PrismaService,
    PrismaServiceOld,
    DataChargeService,
    ProfileService,
    PlanService,
    SimsService,
    UserService,
  ],
})
export class DataChargeModule {}
