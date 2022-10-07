import { Module } from '@nestjs/common';
import { PlanController } from './plan.controller';

@Module({
  controllers: [PlanController],
})
export class PlanModule {}
