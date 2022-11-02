import { Controller, Get, Headers, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { IRequestWithUser } from 'src/common/interfaces/request_with_user.interface';
import { SuccessResponseDto } from 'src/common/responses/success-response.dto';
import { LineService } from 'src/modules/line/line.service';

@Controller()
export class LineController {
  constructor(private readonly lineService: LineService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/suspend_line')
  async getAvailablePlan(
    @Req() req: IRequestWithUser,
    @Headers('X-Phone-Number') phoneNumber,
  ): Promise<SuccessResponseDto> {
    const { user } = req;
    return await this.lineService.SuspendLine({ id: user.gtn_id, phoneNumber });
  }
}
