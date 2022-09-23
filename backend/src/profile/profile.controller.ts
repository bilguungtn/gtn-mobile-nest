import { Controller, Get, Query } from '@nestjs/common';
import { ProfileService } from 'src/profile/profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * Get user info.
   * @returns {any}
   */
  @Get('/importUser')
  async importUser() {
    return await this.profileService.importUser();
  }
}
