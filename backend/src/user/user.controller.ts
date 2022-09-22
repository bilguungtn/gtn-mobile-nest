import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UserResponseDto } from 'src/user/dto/responses/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get many users.
   * @returns {UserResponseDto[]}
   */
  @Get('/all')
  async find(): Promise<UserResponseDto[]> {
    const users = await this.userService.find();
    console.log(users, 'users');
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
    console.log(query.email, 'email');
    return await this.userService.findByEmailAddress(query.email);
  }
}
