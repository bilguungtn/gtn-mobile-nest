import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from 'src/common/guards/basic-auth.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import {
  CreateUserRequestDto,
  LoginRequestDto,
} from 'src/user/dto/requests/user.dto';
import { SuccessResponseDto } from 'src/common/responses/success-response.dto';
import { LoginResponseDto } from 'src/auth/dto/response/loginResponse.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Login.
   * @param {LoginRequestDto} payload
   * @returns {LoginResponseDto}
   */
  @UseGuards(BasicAuthGuard)
  @Post('/login')
  public async login(
    @Body() payload: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return this.authService.login(payload);
  }

  /**
   * Create user.
   * @param {RegisterUserRequestDto} createUserRequest New user data
   * @returns {SuccessResponseDto}
   */
  // @UseGuards(JwtAuthGuard)
  @Post('/register')
  public async register(
    @Body() createUserRequest: CreateUserRequestDto,
  ): Promise<SuccessResponseDto> {
    return await this.authService.register(createUserRequest);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  public async get(@Req() req: any) {
    console.log(req.user);
    return 'get';
  }
}
