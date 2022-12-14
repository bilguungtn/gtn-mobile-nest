import { Controller, Get, Headers, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { IRequestWithUser } from 'src/common/interfaces/request_with_user.interface';
import { DataChargeService } from 'src/modules/data-charge/data-charge.service';

@Controller()
export class DataChargeController {
  constructor(private readonly dataChargeService: DataChargeService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/data_charges')
  async getDataChargeList(
    @Req() req: IRequestWithUser,
    @Headers('X-Phone-Number') phoneNumber: string,
  ): Promise<any> {
    const { user } = req;
    return await this.dataChargeService.getDataChargeList(
      user.gtn_id,
      phoneNumber,
    );
  }
}
