import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ProfileController } from 'src/modules/profile/profile.controller';
import { ProfileService } from 'src/modules/profile/profile.service';
import { SimsService } from 'src/modules/sims/sims.service';

@Module({
  controllers: [ProfileController],
  providers: [PrismaService, ProfileService, SimsService],
})
export class ProfileModule {}
