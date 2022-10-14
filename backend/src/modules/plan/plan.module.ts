import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PlanController } from 'src/modules/plan/plan.controller';
import { PlanService } from 'src/modules/plan/plan.service';

@Module({
  controllers: [PlanController],
  providers: [PrismaService, PlanService],
})
export class PlanModule {}
