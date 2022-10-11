import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from 'src/modules/profile/profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { SuccessResponseDto } from 'src/common/responses/success-response.dto';

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
   * Update profile.
   * @param {UpdateUserProfileRequest} data
   * @returns {SuccessResponseDto}
   */
  @Put('/profile_info/:id')
  async updateProfile(
    @Body() data: any,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return await this.profileService.updateProfile(data, id);
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
