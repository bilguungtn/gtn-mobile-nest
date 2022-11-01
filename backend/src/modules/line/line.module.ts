import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { PrismaService } from 'prisma/prisma.service';
import { LineController } from './line.controller';
import { LineService } from './line.service';
import { join } from 'path';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mailing',
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
  ],
  controllers: [LineController],
  providers: [LineService, PrismaService],
})
export class LineModule {}
