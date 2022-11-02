import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class SimsService {
  constructor(private prismaService: PrismaService) {}

  public async findBySimNumberAndProfileId(
    id: number,
    simNumber: string,
  ): Promise<any> {
    const profile = await this.prismaService.sims.findFirst({
      where: { profile_id: +id, sim_number: simNumber },
      select: {
        profile_id: true,
        sim_number: true,
        happiness_id: true,
        canceled_at: true,
      },
    });
    return profile || null;
  }
  
  public async showSimInfo(id: any): Promise<any> {
    return await this.prismaService.sims.findFirst({
      where: { profile_id: id },
    });
  }
}
