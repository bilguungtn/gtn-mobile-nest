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
import { UpdatePlanRequestDto } from './dto/request/plan.dto';
import { ProfileService } from 'src/modules/profile/profile.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class PlanService {
  constructor(
    private prismaService: PrismaService,
    private readonly profileServcie: ProfileService,
    private readonly userService: UserService,
    private readonly simService: SimsService,
    @InjectQueue('mailing') private readonly mailingQueue: Queue,
  ) {}

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

  public async updateCurrentPlan(
    data: UpdatePlanRequestDto,
    { gtnId, phoneNumber },
  ): Promise<SuccessResponseDto> {
    const profile = await this.profileServcie.getProfileWithSim(
      gtnId,
      phoneNumber,
    );
    const plan = await this.prismaService.plans.findFirst({
      where: { id: +data.plan_id },
    });
    if (!plan)
      throw new HttpException('PLAN DOES NOT EXIST', HttpStatus.NO_CONTENT);
    await this.mailingQueue.add('change-plan', {
      profile,
      plan,
      applicationDate: data.application_date,
    });
    const res: any = {
      statusCode: 200,
      message: 'Sent email',
    };
    return res;
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
}
