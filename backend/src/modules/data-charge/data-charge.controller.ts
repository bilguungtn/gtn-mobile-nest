import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { IRequestWithUser } from 'src/common/interfaces/request_with_user.interface';
import { DataChargeService } from 'src/modules/data-charge/data-charge.service';

@Controller()
export class DataChargeController {
  constructor(private readonly dataChargeService: DataChargeService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/applydata')
  async getAvailablePlan(@Req() req: IRequestWithUser): Promise<any> {
    const { user } = req;
    return await this.dataChargeService.applyDataCharge(
      {
        plan_id: '701201118',
        data_charge_id: 1,
      },
      user,
    );
  }
}