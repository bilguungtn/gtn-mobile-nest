import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SuccessResponseDto } from 'src/common/responses/success-response.dto';
import { readFileSync } from 'fs';
import { parse } from 'papaparse';
import { PlanGroupDto } from './dto/response/plan.dto';
import { toPlanGroupDto } from './dto/dto-mapper.helper';
import { formatCapacity } from 'src/common/helpers/csv.helper';

@Injectable()
export class PlanService {
  constructor(private prismaService: PrismaService) {}

  public async getAvailablePlan(): Promise<PlanGroupDto> {
    const available_plan_groups =
      await this.prismaService.plan_groups.findMany();
    return toPlanGroupDto(available_plan_groups);
  }

  deadlineFormat = (deadline: string) => {
    let deadlines = {
      deadline_day: null,
      deadline_time: null,
    };
    switch (deadline) {
      case '15日営業時間(18:30)まで':
        deadlines = {
          deadline_day: '15',
          deadline_time: '18:30',
        };
        break;
      case '月末の最終日以外なら翌月受付対応可能':
        deadlines = {
          deadline_day: '15',
          deadline_time: '18:30',
        };
        break;
      default:
        deadlines;
    }
    return deadlines;
  };

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
      // return data;
      for (const item of data) {
        this.createDataCharge(item);
      }
      await this.prismaService.plan_groups.deleteMany();

      for (const item of data) {
        // header name ni csv deeree yapon
        const planGroupId = item['plan_group_id'];
        // deadline parse

        const deadline = this.deadlineFormat(item['deadline_time']);

        if (planGroupId !== '-' && planGroupId) {
          const planItem = {
            id: +item['happiness_id'],
            name: item['name'],
            happiness_name: item['happiness_id'],
            capacity:
              Object.values(item)[1] === 'なし'
                ? null
                : parseFloat(item['capacity']),
            // todo carrier type  String(Object.values(item)[10])
            carrier_type_code: 99,
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
        }
      }

      this.planImportPrice();
      const res: any = {
        statusCode: 201,
        message: 'Created user data.',
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
      const price = item['price'].replace(/円|,/g, '');
      if (price !== '')
        await this.prismaService.plans.update({
          where: { id: +item['happiness_id'] },
          data: {
            price: +price,
          },
        });
    }
    const res: any = {
      statusCode: 201,
      message: 'Updated.',
    };
    return res;
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

  public async createDataCharge(data): Promise<any> {
    try {
      const capacityString = data.capacity_mb;
      if (capacityString === '不可' || capacityString === '') return null;
      console.log(capacityString, 'capacityString');
      const priceString = data.price;
      const availableCountString = data.time_display;
      const capacity = formatCapacity(capacityString);
      // const price
    } catch (error) {}
  }
}
