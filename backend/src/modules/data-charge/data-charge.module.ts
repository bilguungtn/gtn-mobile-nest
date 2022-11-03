import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PlanModule } from '../plan/plan.module';
import { PlanService } from '../plan/plan.service';
import { ProfileService } from '../profile/profile.service';
import { SimsService } from '../sims/sims.service';
import { DataChargeController } from './data-charge.controller';
import { DataChargeService } from './data-charge.service';

@Module({
  imports: [PlanModule],
  controllers: [DataChargeController],
  providers: [
    PrismaService,
    DataChargeService,
    ProfileService,
    PlanService,
    SimsService,
  ],
})
export class DataChargeModule {}
