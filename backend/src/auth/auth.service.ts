import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import {
  CreateUserRequestDto,
  LoginRequestDto,
} from 'src/user/dto/requests/user.dto';
import { UserResponseDto } from 'src/user/dto/responses/user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async validateUser(payload: any): Promise<any> {
    const { email, password } = payload;
    const user = await this.userService.getUser(email);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    if (user) return user;
    return null;
  }

  async login(loginRequestDto: LoginRequestDto) {
    const user: UserResponseDto = await this.userService.login(loginRequestDto);
    return {
      user,
      access_token: this.jwtService.sign(loginRequestDto),
    };
  }

  async register(createUserRequest: CreateUserRequestDto) {
    return await this.userService.register(createUserRequest);
  }
}
