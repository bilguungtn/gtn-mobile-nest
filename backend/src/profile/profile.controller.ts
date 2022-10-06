import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
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
   * Get profile by gtnId.
   * @param {string} id
   * @returns {any}
   */
  @Get('/profile_info/:id')
  async getProfile(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return await this.profileService.getProfile(id);
  }

  /**
   * Update.
   * @param {UpdateUserProfileRequest} data
   * @returns {any}
   */
  @Put('/profile_info')
  async updateProfile(@Body() data: any) {
    return await this.profileService.updateProfile(data);
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
