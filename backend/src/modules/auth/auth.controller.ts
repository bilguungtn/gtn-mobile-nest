import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiResponse } from '@nestjs/swagger';
import { BasicAuthGuard } from 'src/common/guards/basic-auth.guard';
import { AuthService } from 'src/modules/auth/auth.service';
import { LoginRequestDto } from 'src/modules/user/dto/requests/user.dto';
import { LoginResponseDto } from 'src/modules/auth/dto/response/loginResponse.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Login.
   * @param {LoginRequestDto} payload
   * @returns {LoginResponseDto}
   */
  @UseGuards(BasicAuthGuard)
  @ApiBasicAuth()
  @ApiResponse({ description: 'Email return', type: LoginResponseDto })
  @Post('/login')
  public async login(@Body() payload: LoginRequestDto): Promise<any> {
    return this.authService.login(payload);
  }

  // /**
  //  * Create user.
  //  * @param {RegisterUserRequestDto} createUserRequest New user data
  //  * @returns {SuccessResponseDto}
  //  */
  // @UseGuards(BasicAuthGuard)
  // @Post('/register')
  // public async register(
  //   @Body() createUserRequest: CreateUserRequestDto,
  // ): Promise<SuccessResponseDto> {
  //   return await this.authService.register(createUserRequest);
  // }
}
