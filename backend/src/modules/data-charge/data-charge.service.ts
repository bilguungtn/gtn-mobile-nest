import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  formatAvailableCount,
  formatCapacity,
  formatPrice,
} from 'src/common/helpers/csv.helper';
import { PlanService } from 'src/modules/plan/plan.service';
import {
  DataChargeRequestDto,
  toDataChargeList,
} from 'src/modules/data-charge/dto/request/data-charge.dto';
import { SimsService } from 'src/modules/sims/sims.service';

@Injectable()
export class DataChargeService {
  constructor(
    private prismaService: PrismaService,
    private readonly planService: PlanService,
    private readonly simService: SimsService,
  ) {}

  public async createDataCharge(data): Promise<any> {
    try {
      const capacityString = data.capacity_mb;
      if (capacityString === '不可' || capacityString === '') return null;
      const capacity = formatCapacity(capacityString);
      const price = formatPrice(data.price);
      const available_count = formatAvailableCount(data.time_display);

      const data_charge = await this.prismaService.data_charges.create({
        data: {
          capacity,
          price,
          available_count,
          plan_groups_id: +data.plan_group_id,
        },
      });

      return data_charge;
      // const price
    } catch (error) {}
  }

  public async applyDataCharge(
    data: DataChargeRequestDto,
    user: any,
  ): Promise<any> {
    const mainPlanId = await this.planService.getMainPlanIdByUserId(
      user.gtn_id,
    );

    if (mainPlanId !== parseInt(data.plan_id)) throw new NotFoundException();

    const eloquentDatacharge = await this.prismaService.data_charges.findFirst({
      where: {
        id: data.data_charge_id,
      },
    });

    if (!eloquentDatacharge) throw new NotFoundException();

    return eloquentDatacharge;
  }

  public async getDataChargeList(
    id: number,
    phoneNumber: string,
  ): Promise<any> {
    const mainPlanId = await this.planService.getMainPlanIdByUserId(id);
    const sims = await this.simService.getSims(id);

    const dataChargeData = await this.prismaService.plans.findFirst({
      where: { id: mainPlanId },
      select: {
        plan_groups: {
          select: {
            data_charges: true,
          },
        },
      },
    });
    return toDataChargeList(dataChargeData.plan_groups.data_charges);
  }
}
