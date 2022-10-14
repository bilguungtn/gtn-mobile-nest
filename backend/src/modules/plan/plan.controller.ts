import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { IRequestWithUser } from 'src/common/interfaces/request_with_user.interface';
import { PlanService } from './plan.service';

@Controller()
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/available_plan')
  async getAvailablePlan(@Req() req: IRequestWithUser) {
    const { user } = req;
    await this.planService.getAvailablePlan(user.gtn_id);
    return '';
  }
}
