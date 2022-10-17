import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SuccessResponseDto } from 'src/common/responses/success-response.dto';
import { readFileSync } from 'fs';
import { parse } from 'papaparse';
import { PlanGroupDto } from './dto/response/plan.dto';
import { toPlanGroupDto } from './dto/dto-mapper.helper';

@Injectable()
export class PlanService {
  constructor(private prismaService: PrismaService) {}

  public async getAvailablePlan(): Promise<PlanGroupDto> {
    const available_plan_groups =
      await this.prismaService.plan_groups.findMany();
    return toPlanGroupDto(available_plan_groups);
  }

  public async initialPlanImport(): Promise<SuccessResponseDto> {
    try {
      const { data } = await this.planImport();

      if (!data) throw new HttpException('bad request', 400);

      for (const item of data) {
        // header name ni csv deeree yapon
        const planGroupId = String(Object.values(item)[3]);
        // deadline parse
        const deadline_day = String(Object.values(item)[11]);
        const deadline_time = String(Object.values(item)[11]);

        if (planGroupId !== '-' && planGroupId) {
          const planItem = {
            id: parseInt(String(Object.values(item)[7])),
            name: String(Object.values(item)[2]),
            happiness_name: String(Object.values(item)[8]),
            capacity:
              Object.values(item)[1] === 'なし'
                ? null
                : parseFloat(String(Object.values(item)[1])),
            // todo carrier type  String(Object.values(item)[10])
            carrier_type_code: 99,
          };
          await this.prismaService.plan_groups.upsert({
            where: { id: +planGroupId },
            create: {
              id: +planGroupId,
              deadline_day,
              deadline_time,
              available_change_plan: true,
              current_plan: true,
              plans: {
                create: planItem,
              },
            },
            update: {
              deadline_day,
              deadline_time,
              available_change_plan: true,
              current_plan: true,
              plans: {
                create: planItem,
              },
            },
          });
        } else {
          // await this.prismaService.plan_groups.create({
          //   data: {
          //     deadline_day,
          //     deadline_time,
          //   },
          // });
        }
      }
      const res: any = {
        statusCode: 201,
        message: 'Created user data.',
      };
      return res;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async planImport(): Promise<any> {
    const csvFile = readFileSync('files/plan_data.csv');
    const csvData = csvFile.toString();
    const parsedCsv = await parse(csvData, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().replace('#', '').trim(),
      complete: (results) => results.data,
    });
    return parsedCsv;
  }
}
