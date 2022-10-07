import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { UserResponseDto } from 'src/modules/user/dto/responses/user.dto';

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
    return await this.userService.getUser(id);
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
