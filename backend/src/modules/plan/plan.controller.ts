import {
  Controller,
  Get,
  Headers,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { IRequestWithUser } from 'src/common/interfaces/request_with_user.interface';
import { PlanGroupDto } from './dto/response/plan.dto';
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
    @Headers('X-Phone-Number') phoneNumber: string,
  ): Promise<PlanGroupDto> {
    return await this.planService.getAvailablePlan(phoneNumber);
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
    @Headers('X-Phone-Number') phoneNumber: string,
  ): Promise<any> {
    return await this.planService.getCurrentPlan(phoneNumber);
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

  // /**
  //  * Get profile by id.
  //  * @param {any} req
  //  * @returns {any}
  //  */
  // @UseGuards(JwtAuthGuard)
  // @Get('/plan_id')
  // async getMainPlanIdByUserId(@Req() req: IRequestWithUser) {
  //   const { user } = req;
  //   return await this.planService.getMainPlanIdByUserId(user.gtn_id);
  // }
}
