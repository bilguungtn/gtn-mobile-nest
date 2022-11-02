import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { toSimsDto } from './dto/dto-mapper.helper';
import { SimResponseDto, SimsFullDto } from './dto/responses/get_sims.dto';

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

  public async getSims(id: number): Promise<any> {
    // active umnuh sar deer 1 sar nemeed suuliin udur ni >= now()
    const eloquentSims: SimsFullDto[] = await this.prismaService
      .$queryRaw`SELECT * FROM sims where LAST_DAY(DATE_ADD(sims.canceled_at, INTERVAL 1 MONTH)) >= NOW() && profile_id=${id} ORDER BY sims.created_at DESC`;
    return eloquentSims.map((item) => toSimsDto(item));
  }
}
