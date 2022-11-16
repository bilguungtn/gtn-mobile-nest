import { Module } from '@nestjs/common';
import { PrismaServiceOld } from 'prisma/prisma.service';
import { TaskService } from './task.service';

@Module({
  providers: [TaskService, PrismaServiceOld],
})
export class TaskModule {}
