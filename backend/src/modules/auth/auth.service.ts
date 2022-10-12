import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import {
  CreateUserRequestDto,
  LoginRequestDto,
} from 'src/modules/user/dto/requests/user.dto';
import { UserResponseDto } from 'src/modules/user/dto/responses/user.dto';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async validateUser(payload: any): Promise<any> {
    const { id, password } = payload;
    const user = await this.userService.getUser(id);
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
      access_token: this.jwtService.sign(user),
    };
  }

  async register(createUserRequest: CreateUserRequestDto) {
    return await this.userService.register(createUserRequest);
  }
}
