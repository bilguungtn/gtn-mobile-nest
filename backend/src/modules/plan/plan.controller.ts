import {
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { IRequestWithUser } from 'src/common/interfaces/request_with_user.interface';
import { PlanGroupDto } from './dto/response/plan.dto';
import { PlanService } from './plan.service';

@Controller()
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/available_plan')
  async getAvailablePlan(@Req() req: IRequestWithUser): Promise<PlanGroupDto> {
    return await this.planService.getAvailablePlan();
  }

  /**
   * Get profile data from csv.
   * @returns {any}
   */
  @UseInterceptors(
    FileInterceptor('file_asset', {
      storage: diskStorage({
        destination: './files',
      }),
    }),
  )
  @Get('/plan_import')
  async initialPlanImport() {
    return await this.planService.initialPlanImport();
  }

  @Get('/plan_import_price')
  async planImportPrice() {
    return await this.planService.planImportPrice();
  }

  /**
   * Get profile by id.
   * @param {any} req
   * @returns {any}
   */
  @UseGuards(JwtAuthGuard)
  @Get('/plan_id')
  async getMainPlanIdByUserId(@Req() req: IRequestWithUser) {
    const { user } = req;
    return await this.planService.getMainPlanIdByUserId(user.gtn_id);
  }
}
