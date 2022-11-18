import { Module } from '@nestjs/common';
import { PrismaService, PrismaServiceOld } from 'prisma/prisma.service';
import { PlanController } from 'src/modules/plan/plan.controller';
import { PlanService } from 'src/modules/plan/plan.service';
import { DataChargeService } from 'src/modules/data-charge/data-charge.service';
import { ProfileService } from 'src/modules/profile/profile.service';
import { SimsService } from '../sims/sims.service';
import { UserService } from '../user/user.service';

@Module({
  controllers: [PlanController],
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
export class PlanModule {}
