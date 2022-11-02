import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { PrismaService } from 'prisma/prisma.service';
import { LineController } from 'src/modules/line/line.controller';
import { LineService } from 'src/modules/line/line.service';
import { SimsService } from 'src/modules/sims/sims.service';
import { ProfileService } from 'src/modules/profile/profile.service';

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
  providers: [LineService, PrismaService, SimsService, ProfileService],
})
export class LineModule {}
