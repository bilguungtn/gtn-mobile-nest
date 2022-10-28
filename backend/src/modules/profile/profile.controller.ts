import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProfileService } from 'src/modules/profile/profile.service';
import { SuccessResponseDto } from 'src/common/responses/success-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { IRequestWithUser } from 'src/common/interfaces/request_with_user.interface';
import {
  PasswordReqDto,
  ProfileReqDto,
} from 'src/modules/profile/dto/requests/profile.dto';
import { LoginInfoDto } from 'src/modules/profile/dto/login_info.dto';
import { ProfileDto } from './dto/response/profile.dto';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * Get profile by id.
   * @param {IRequestWithUser} req
   * @returns {any}
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ description: 'Profile', type: ProfileDto })
  @Get('/profile_info')
  async getProfile(@Req() req: IRequestWithUser) {
    const { user } = req;
    return await this.profileService.getProfile(user.gtn_id);
  }

  /**
   * Update profile.
   * @param {ProfileReqDto} data
   * @param {IRequestWithUser} req
   * @returns {SuccessResponseDto}
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Profile updated',
    type: SuccessResponseDto,
  })
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
   * @param {LoginInfoDto} data
   * @param {IRequestWithUser} req
   * @returns {SuccessResponseDto}
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiCreatedResponse({ description: 'Email return', type: LoginInfoDto })
  @Get('/login_info')
  async loginInfo(@Req() req: IRequestWithUser): Promise<LoginInfoDto> {
    const { user } = req;
    return await this.profileService.loginInfo(user.gtn_id);
  }

  /**
   * Update profile.
   * @param {LoginInfoDto} data
   * @param {IRequestWithUser} req
   * @returns {SuccessResponseDto}
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'EMAIL_UPDATED' })
  @ApiResponse({ status: 201, description: 'VERIFICATION_EMAIL_SENT' })
  @ApiFoundResponse({ status: 302, description: 'EMAIL_ALREADY_USED' })
  @Patch('/login_info')
  async changeEmail(
    @Body() data: LoginInfoDto,
    @Req() req: IRequestWithUser,
    @Headers('X-Phone-Number') phoneNumber,
  ): Promise<SuccessResponseDto> {
    const { user } = req;
    return await this.profileService.changeEmail(user.gtn_id, data.email);
  }

  /**
   * Update profile.
   * @param {PasswordReqDto} data
   * @param {IRequestWithUser} req
   * @returns {SuccessResponseDto}
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Changed' })
  @Patch('/password')
  async newPassword(
    @Body() data: PasswordReqDto,
    @Req() req: IRequestWithUser,
  ): Promise<any> {
    const { user } = req;
    return await this.profileService.newPassword(user.gtn_id, data);
  }

  // /**
  //  * Get profile data from csv.
  //  * @returns {any}
  //  */
  // @UseInterceptors(
  //   FileInterceptor('file_asset', {
  //     storage: diskStorage({
  //       destination: './files',
  //     }),
  //   }),
  // )
  // @Get('/salesForceCustumorImporter')
  // async salesForceCustumorImporter() {
  //   return await this.profileService.salesForceCustumorImporter();
  // }
}
