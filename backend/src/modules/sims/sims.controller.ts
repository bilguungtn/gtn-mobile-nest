import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { IRequestWithUser } from 'src/common/interfaces/request_with_user.interface';
import { SimResponseDto } from './dto/responses/get_sims.dto';
import { SimsService } from './sims.service';

@Controller()
export class SimsController {
  constructor(private readonly simsService: SimsService) {}

  /**
   * Get sim information by id.
   * @param {IRequestWithUser} req
   * @returns {SimResponseDto}
   */
  @UseGuards(JwtAuthGuard)
  @Get('/sims')
  async getSims(@Req() req: IRequestWithUser): Promise<SimResponseDto[]> {
    const { user } = req;
    return await this.simsService.getSims(user.gtn_id);
  }
}
