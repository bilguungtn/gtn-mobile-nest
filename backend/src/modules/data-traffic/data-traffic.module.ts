import { Module } from '@nestjs/common';
import { DataTrafficService } from './data-traffic.service';
import { DataTrafficController } from './data-traffic.controller';
import { PlanService } from 'src/modules/plan/plan.service';
import { PrismaService, PrismaServiceOld } from 'prisma/prisma.service';
import { ProfileService } from 'src/modules/profile/profile.service';
import { SimsService } from 'src/modules/sims/sims.service';

@Module({
  providers: [
    DataTrafficService,
    PrismaService,
    ProfileService,
    PlanService,
    PrismaServiceOld,
    SimsService,
  ],
  controllers: [DataTrafficController],
})
export class DataTrafficModule {}
