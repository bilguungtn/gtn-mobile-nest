import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from 'src/modules/profile/profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { SuccessResponseDto } from 'src/common/responses/success-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { IRequestWithUser } from 'src/common/interfaces/request_with_user.interface';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // /**
  //  * Get import user.
  //  * @returns {any}
  //  */
  // @Get('/importUser')
  // async importUser() {
  //   return await this.profileService.importUser();
  // }

  /**
   * Get profile by id.
   * @param {any} req
   * @returns {any}
   */
  @UseGuards(JwtAuthGuard)
  @Get('/profile_info')
  async getProfile(@Req() req: IRequestWithUser) {
    const { user } = req;
    return await this.profileService.getProfile(user.gtn_id);
  }

  /**
   * Update profile.
   * @param {UpdateUserProfileRequest} data
   * @returns {SuccessResponseDto}
   */
  @UseGuards(JwtAuthGuard)
  @Patch('/profile_info')
  async updateProfile(@Body() data: any, @Req() req: any) {
    const { user } = req;
    return await this.profileService.updateProfile(data, user.gtn_id);
  }

  /**
   * Update profile.
   * @param {UpdateUserProfileRequest} data
   * @returns {SuccessResponseDto}
   */
  @UseGuards(JwtAuthGuard)
  @Patch('/login_info')
  async changeEmail(@Body() data: any, @Req() req: any) {
    const { user } = req;
    return await this.profileService.changeEmail(user.gtn_id, data.email);
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
  @Get('/salesForceCustumorImporter')
  async salesForceCustumorImporter() {
    return await this.profileService.salesForceCustumorImporter();
  }

  /**
   * create profile.
   * @param {data}
   * @returns {any}
   */
  @Post('/create')
  async createProfile(@Body() data: any) {
    return await this.profileService.createProfile(data);
  }
}
