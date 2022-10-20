import { Module } from '@nestjs/common';
import { SimsService } from './sims.service';
import { SimsController } from './sims.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [SimsController],
  providers: [PrismaService, SimsService],
})
export class SimsModule {}
