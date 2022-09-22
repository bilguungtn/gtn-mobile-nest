import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserResponseDto } from 'src/user/dto/responses/user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  // users
  public async find(): Promise<UserResponseDto[]> {
    const data = this.prismaService.users.findMany();
    return data;
  }
  public async findByEmailAddress(email: string): Promise<UserResponseDto[]> {
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
