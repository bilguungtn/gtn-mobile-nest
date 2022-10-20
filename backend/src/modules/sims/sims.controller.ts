import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { IRequestWithUser } from 'src/common/interfaces/request_with_user.interface';
import { SimsService } from './sims.service';

@Controller()
export class SimsController {
  constructor(private readonly simsService: SimsService) {}

  /**
   * Get sim information by id.
   * @param {any} req
   * @returns {any}
   */
  @UseGuards(JwtAuthGuard)
  @Get('/sims')
  async getProfile(@Req() req: IRequestWithUser) {
    const { user } = req;
    return await this.simsService.showSimInfo(user.gtn_id);
  }
}
