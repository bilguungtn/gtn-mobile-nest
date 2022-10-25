import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  formatAvailableCount,
  formatCapacity,
  formatPrice,
} from 'src/common/helpers/csv.helper';
import { PlanService } from '../plan/plan.service';
import { DataChargeRequestDto } from './dto/request/data-charge.dto';

@Injectable()
export class DataChargeService {
  constructor(
    private prismaService: PrismaService,
    private readonly planService: PlanService,
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
          data_charges_plan_groups: {
            create: {
              plan_group_id: +data.plan_group_id,
            },
          },
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
    const plan_id = parseInt(data.plan_id);
    console.log(mainPlanId, plan_id);

    if (mainPlanId !== plan_id) throw new NotFoundException();

    const eloquentDatacharge = await this.prismaService.data_charges.findFirst({
      where: {
        id: data.data_charge_id,
      },
    });

    if (!eloquentDatacharge) throw new NotFoundException();
    console.log(eloquentDatacharge);

    return eloquentDatacharge;
  }
}
