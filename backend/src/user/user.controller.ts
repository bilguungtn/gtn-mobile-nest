import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UserResponseDto } from 'src/user/dto/responses/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get user info.
   * @returns {UserResponseDto}
   */
  @Get('/profile_info')
  async getProfile() {
    const id = '1';
    return await this.userService.getProfile(id);
  }

  /**
   * Get many users.
   * @returns {UserResponseDto[]}
   */
  @Get('/all')
  async find(): Promise<UserResponseDto[]> {
    const users = await this.userService.find();
    return users;
  }

  /**
   * Get many users.
   * @param {string} email email address
   * @returns {UserResponseDto[]}
   */
  @Get('/byEmail')
  async findByEmailAddress(
    @Query() query: { email: string },
  ): Promise<UserResponseDto[]> {
    return await this.userService.findByEmailAddress(query.email);
  }
}
