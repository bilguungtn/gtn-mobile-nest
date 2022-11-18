import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { parse } from 'papaparse';
import { PrismaService } from 'prisma/prisma.service';
import { SuccessResponseDto } from 'src/common/responses/success-response.dto';
import {
  carrierTypeCode,
  deadlineFormat,
  formatAvailableCount,
  formatCapacity,
  formatPrice,
} from 'src/common/helpers/csv.helper';
import {
  AvailablePlanResponseDto,
  CurrentPlanResponseDto,
} from 'src/modules/plan/dto/response/plan.dto';
import {
  toAvailablePlanDto,
  toCurrentPlanDto,
} from 'src/modules/plan/dto/dto-mapper.helper';
import { SimsService } from 'src/modules/sims/sims.service';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class PlanService {
  constructor(
    private prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly simService: SimsService,
  ) {}

  // TODO: database connection might change
  public async getAvailableChangePlans({
    gtnId,
    phoneNumber,
  }): Promise<AvailablePlanResponseDto[]> {
    try {
      const planList = [];
      const sim = await this.simService.findBySimNumberAndProfileId(
        gtnId,
        phoneNumber,
      );
      if (!sim) {
        throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
      }
      const mainId = await this.getMainPlanIdByUserId(sim.happiness_id);

      const current_plan = await this.prismaService.plans.findFirst({
        where: { id: +mainId },
      });

      const availableChangePlanGroupIds =
        await this.prismaService.plan_groups_relations.findMany({
          where: {
            current_plan_group_id: current_plan.plan_group_id,
          },
        });

      for (const availablePlanGroup of availableChangePlanGroupIds) {
        const plans = await this.prismaService.plans.findMany({
          where: {
            NOT: { plan_group_id: current_plan.plan_group_id },
            plan_group_id: availablePlanGroup.available_change_plan_group_id,
          },
        });
        if (plans.length)
          plans.map((plan) => planList.push(toAvailablePlanDto(plan)));
      }

      return planList;
    } catch (err) {
      throw err;
    }
  }

  public async getCurrentPlan({
    gtnId,
    phoneNumber,
  }): Promise<CurrentPlanResponseDto> {
    try {
      const sim = await this.simService.findBySimNumberAndProfileId(
        gtnId,
        phoneNumber,
      );
      if (!sim) {
        throw new HttpException('Sim not found', HttpStatus.NOT_FOUND);
      }
      const activeUser = await this.userService.getValidUser(sim.happiness_id);
      const plan = await this.prismaService.plans.findFirst({
        where: { id: +activeUser.service_id },
      });
      if (!plan) {
        throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
      }
      return toCurrentPlanDto(activeUser, plan);
    } catch (err) {
      throw err;
    }
  }

  public async getMainPlanIdByUserId(id: string): Promise<string> {
    try {
      const user = await this.userService.getValidUser(id);
      if (!user) throw new HttpException('plan not found', 400);
      return user.service_id;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  public async initialPlanImport(): Promise<any> {
    try {
      const csvFile = readFileSync('files/plan_data.csv');
      const csvData = csvFile.toString();
      const csvParse = parse(csvData, {
        header: true,
        skipEmptyLines: true,
        beforeFirstChunk: function (chunk) {
          const rows = chunk.split(/\r\n|\r|\n/);
          rows[0] =
            'item_name, capacity_gb, name, plan_group_id, capacity_mb, price, time_display, happiness_id, happiness_name, charge_plan, carrier_type, deadline_time';
          return rows.join('\r\n');
        },
        transformHeader: (header) =>
          header.toLowerCase().replace('#', '').trim(),
        complete: (results) => results.data,
      });
      const { data } = csvParse;
      if (!data) throw new HttpException('bad request', 400);
      await this.prismaService.plan_groups.deleteMany();

      for (const item of data) {
        // header name ni csv deeree yapon
        const planGroupId = item['plan_group_id'];
        // deadline parse

        const deadline = deadlineFormat(item['deadline_time']);

        if (planGroupId !== '-' && planGroupId) {
          const planItem = {
            id: +item['happiness_id'],
            name: item['name'],
            happiness_name: item['happiness_id'],
            capacity:
              Object.values(item)[1] === 'なし'
                ? null
                : parseFloat(item['capacity']),
            carrier_type_code: carrierTypeCode(item['carrier_type']),
          };
          await this.prismaService.plan_groups.upsert({
            where: { id: +planGroupId },
            create: {
              id: +planGroupId,
              deadline_day: deadline.deadline_day,
              deadline_time: deadline.deadline_time,
              available_change_plan: true,
              current_plan: true,
              plans: {
                create: planItem,
              },
            },
            update: {
              deadline_day: deadline.deadline_day,
              deadline_time: deadline.deadline_time,
              available_change_plan: true,
              current_plan: true,
              plans: {
                create: planItem,
              },
            },
          });
          this.createDataCharge(item);
        }
      }

      const res: any = {
        statusCode: 201,
        message: 'imported data charges and plan.',
      };
      return res;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async planImportPrice(): Promise<SuccessResponseDto> {
    const csvData = readFileSync('files/plan_data_with_price.csv').toString();

    const parsedCsv = parse(csvData, {
      header: true,
      skipEmptyLines: true,
      beforeFirstChunk: function (chunk) {
        const rows = chunk.split(/\r\n|\r|\n/);
        rows[0] =
          'item_name,capacity,name,price,plan_group_id,happiness_id,happiness_name,charge_plan,deadline_time,';
        return rows.join('\r\n');
      },
      transformHeader: (header) => header.toLowerCase().replace('#', '').trim(),
      complete: (results) => results.data,
    });
    const { data } = parsedCsv;
    if (!data) throw new HttpException('bad request', 400);
    for (const item of parsedCsv.data) {
      if (item['price'] !== '')
        await this.prismaService.plans.update({
          where: { id: +item['happiness_id'] },
          data: {
            price: formatPrice(item['price']),
          },
        });
    }
    const res: any = {
      statusCode: 201,
      message: 'Updated.',
    };
    return res;
  }

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
    } catch (error) {}
  }
}
