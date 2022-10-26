import { Module } from '@nestjs/common';
import { DataTrafficService } from './data-traffic.service';
import { DataTrafficController } from './data-traffic.controller';
import { PlanService } from 'src/modules/plan/plan.service';
import { PrismaService } from 'prisma/prisma.service';
import { ProfileService } from 'src/modules/profile/profile.service';

@Module({
  providers: [DataTrafficService, PrismaService, ProfileService, PlanService],
  controllers: [DataTrafficController],
})
export class DataTrafficModule {}
