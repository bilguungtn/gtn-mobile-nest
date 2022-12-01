import {
  Body,
  Controller,
  Get,
  Headers,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { IRequestWithUser } from 'src/common/interfaces/request_with_user.interface';
import { SuccessResponseDto } from 'src/common/responses/success-response.dto';
import { UpdatePlanRequestDto } from './dto/request/plan.dto';
import {
  AvailablePlanResponseDto,
  CurrentPlanResponseDto,
  PlanGroupResponseDto,
} from './dto/response/plan.dto';
import { PlanService } from './plan.service';

@Controller()
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiHeader({
    name: 'X-Phone-Number',
    description: '電話番号(SIM番号)を投げてください example: 09000000000',
    example: '09000000000',
  })
  @Get('/available_plan')
  async getAvailablePlan(
    @Req() req: IRequestWithUser,
    @Headers('X-Phone-Number') phoneNumber: string,
  ): Promise<AvailablePlanResponseDto[]> {
    const { user } = req;
    return await this.planService.getAvailableChangePlans({
      gtnId: user.gtn_id,
      phoneNumber,
    });
  }

  /**
   * Update current plan.
   * @param {UpdatePlanRequestDto} data
   * @returns {SuccessResponseDto}
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiHeader({
    name: 'X-Phone-Number',
    description: '電話番号(SIM番号)を投げてください example: 09000000000',
    example: '09000000000',
  })
  @Patch('/current_plan')
  async updateCurrentPlan(
    @Body() data: UpdatePlanRequestDto,
    @Req() req: IRequestWithUser,
    @Headers('X-Phone-Number') phoneNumber: string,
  ): Promise<any> {
    const { user } = req;
    return await this.planService.updateCurrentPlan(data, {
      gtnId: user.gtn_id,
      phoneNumber,
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiHeader({
    name: 'X-Phone-Number',
    description: '電話番号(SIM番号)を投げてください example: 09000000000',
    example: '09000000000',
  })
  @Get('/current_plan')
  async getCurrentPlan(
    @Req() req: IRequestWithUser,
    @Headers('X-Phone-Number') phoneNumber: string,
  ): Promise<CurrentPlanResponseDto> {
    const { user } = req;
    return await this.planService.getCurrentPlan({
      gtnId: user.gtn_id,
      phoneNumber,
    });
  }
}
