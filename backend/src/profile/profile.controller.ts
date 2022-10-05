import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from 'src/profile/profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * Get import user.
   * @returns {any}
   */
  @Get('/importUser')
  async importUser() {
    return await this.profileService.importUser();
  }

  /**
   * Get import user.
   * @returns {any}
   */
  @Get('/profile_user')
  async getProfile() {
    return await this.profileService.getProfile();
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
   * @returns {any}
   */
  @Post('/create')
  async createProfile() {
    return await this.profileService.createProfile();
  }
}
