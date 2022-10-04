import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UnauthorizedUserException } from 'src/common/exceptions/unauthorized.exception';
import { comparePasswords } from 'src/common/helpers/compare-password.helper';
import { UserResponseDto } from 'src/user/dto/responses/user.dto';
import { LoginRequestDto } from './dto/requests/user.dto';
import { UserAlreadyExistsException } from './exceptions/already-exists.exception';
import * as bcrypt from 'bcrypt';
import { CommonException } from 'src/common/exceptions/common.exception';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  /**
   * getUser.
   * @param {string} param0 email address @param {string} param1 password ==> {LoginRequestDto}
   * @returns
   */
  async getUser(email: string): Promise<any> {
    const data = this.prismaService.users.findFirst({
      where: { email },
    });
    console.log(data, 'data??');
    return data;
  }

  /**
   * Login.
   * @param {string} param0 email address @param {string} param1 password ==> {LoginRequestDto}
   * @returns
   */
  async login({ email, password }: LoginRequestDto): Promise<any> {
    const user = await this.prismaService.users.findFirst({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedUserException();
    }
    // compare password
    const areEqual = await comparePasswords(user.password, password);
    if (!areEqual) {
      throw new UnauthorizedUserException();
    }
    return user;
  }

  /**
   * Register.
   * @param {string} param0 email address @param {string} param1 password ==> {LoginRequestDto}
   * @returns
   */
  async register(createUserRequestDto: any): Promise<any> {
    try {
      console.log(createUserRequestDto, 'createUserRequestDto');
      const inDB = await this.prismaService.users.findFirst({
        where: { email: createUserRequestDto.email },
      });
      if (inDB) {
        throw new UserAlreadyExistsException();
      }
      const pass = await bcrypt.hash(createUserRequestDto.password, 10);

      await this.prismaService.users.create({
        data: {
          name: createUserRequestDto.name,
          email: createUserRequestDto.email,
          password: pass,
        },
      });
      const res: any = {
        statusCode: 201,
        message: 'Created user data.',
      };
      return res;
    } catch (error) {
      throw new CommonException(error);
    }
  }

  // users
  async find(): Promise<UserResponseDto[]> {
    const data = this.prismaService.users.findMany();
    return data;
  }
  async findByEmailAddress(email: string): Promise<UserResponseDto[]> {
    try {
      const data = this.prismaService.users.findMany({
        where: { email },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}
