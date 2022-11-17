import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService, PrismaServiceOld } from 'prisma/prisma.service';
import { SuccessResponseDto } from 'src/common/responses/success-response.dto';
import { readFileSync } from 'fs';
import { parse } from 'papaparse';
import { PlanGroupDto } from 'src/modules/plan/dto/response/plan.dto';
import {
  toCurrentPlanDto,
  toPlanGroupDto,
} from 'src/modules/plan/dto/dto-mapper.helper';
import {
  carrierTypeCode,
  deadlineFormat,
  formatAvailableCount,
  formatCapacity,
  formatPrice,
} from 'src/common/helpers/csv.helper';
import { SimsService } from '../sims/sims.service';
import { firstDayOfPrevMonth } from 'src/common/helpers/date.helper';

@Injectable()
export class PlanService {
  constructor(
    private prismaService: PrismaService,
    private prismaServiceOld: PrismaServiceOld,
    private readonly simService: SimsService,
  ) {}

  // TODO: database connection might change
  public async getAvailablePlan(phoneNumber: string): Promise<PlanGroupDto> {
    try {
      const sim = await this.prismaService.sims.findFirst({
        where: { sim_number: phoneNumber },
        select: { happiness_id: true },
      });

      if (!sim.happiness_id) {
        throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
      }
      const available_plan_groups = await this.prismaService.plans.findMany({
        where: {
          id: +sim.happiness_id,
        },
        select: {
          plan_groups: true,
        },
      });
      return toPlanGroupDto(available_plan_groups);
    } catch (err) {
      throw err;
    }
  }

  // TODO: check
  public async getCurrentPlan({ gtnId, phoneNumber }): Promise<any> {
    try {
      const sim = await this.simService.findBySimNumberAndProfileId(
        gtnId,
        phoneNumber,
      );
      if (!sim) {
        throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
      }
      const profile = await this.prismaServiceOld.user_tbl.findFirst({
        where: {
          use_end_dt: new Date('9999-12-31') || {
            gte: firstDayOfPrevMonth(),
          },
          sim_number: '!=',
          user_id: sim.happiness_id,
          service_type: 1,
        },
        orderBy: {
          use_end_dt: 'desc',
        },
      });
      if (!profile) {
        throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
      }
      const plan = await this.prismaService.plans.findFirst({
        where: { id: +profile.service_id },
      });
      if (!plan) {
        throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
      }

      // dto
      return toCurrentPlanDto(profile, plan);
    } catch (err) {
      throw err;
    }
  }

  public async getMainPlanIdByUserId(id: number): Promise<number> {
    try {
      const sim = await this.prismaService.sims.findFirst({
        where: {
          profile_id: +id,
        },
      });
      if (!sim.happiness_id) throw new HttpException('error', 400);
      const plan_id = await this.prismaService.plans.findUnique({
        where: { id: +sim.happiness_id },
        select: {
          id: true,
        },
      });
      if (!plan_id) throw new HttpException('plan not found', 400);
      return plan_id.id;
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
