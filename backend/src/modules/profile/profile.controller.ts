import {
  Body,
  Controller,
  Get,
  Patch,
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
import { ApiBearerAuth } from '@nestjs/swagger';
import { ProfileReqDto } from './dto/requests/profile.dto';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * Get profile by id.
   * @param {any} req
   * @returns {any}
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('/profile_info')
  async getProfile(@Req() req: IRequestWithUser) {
    const { user } = req;
    return await this.profileService.getProfile(user.gtn_id);
  }

  /**
   * Update profile.
   * @param {ProfileReqDto} data
   * @returns {SuccessResponseDto}
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch('/profile_info')
  async updateProfile(
    @Body() data: ProfileReqDto,
    @Req() req: IRequestWithUser,
  ): Promise<SuccessResponseDto> {
    const { user } = req;
    return await this.profileService.updateProfile(data, user.gtn_id);
  }

  /**
   * Update profile.
   * @param {UpdateUserProfileRequest} data
   * @returns {SuccessResponseDto}
   */
  @UseGuards(JwtAuthGuard)
  @Get('/login_info')
  async loginInfo(@Req() req: any): Promise<SuccessResponseDto> {
    const { user } = req;
    return await this.profileService.loginInfo(user.gtn_id);
  }

  /**
   * Update profile.
   * @param {UpdateUserProfileRequest} data
   * @returns {SuccessResponseDto}
   */
  @UseGuards(JwtAuthGuard)
  @Patch('/login_info')
  async changeEmail(
    @Body() data: any,
    @Req() req: any,
  ): Promise<SuccessResponseDto> {
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
}
