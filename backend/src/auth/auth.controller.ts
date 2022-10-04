import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from 'src/common/guards/basic-auth.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(BasicAuthGuard)
  @Post('/login')
  async login(@Body() payload: any) {
    return this.authService.login(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async get(@Req() req: any) {
    console.log(req.user);
    return 'get';
  }

  @Post('/register')
  public async register(@Body() createUserRequestDto: any): Promise<any> {
    return await this.authService.register(createUserRequestDto);
  }
}
