import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class SimsService {
  constructor(private prismaService: PrismaService) {}
  public async showSimInfo(id: any): Promise<any> {
    return await this.prismaService.sims.findFirst({
      where: { profile_id: id },
    });
  }
}
