import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PlanController } from 'src/modules/plan/plan.controller';
import { PlanService } from 'src/modules/plan/plan.service';
import { DataChargeService } from 'src/modules/data-charge/data-charge.service';
import { ProfileService } from 'src/modules/profile/profile.service';
import { SimsService } from '../sims/sims.service';

@Module({
  controllers: [PlanController],
  providers: [
    PrismaService,
    DataChargeService,
    ProfileService,
    PlanService,
    SimsService,
  ],
})
export class PlanModule {}
