import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [UserController],
  providers: [PrismaService, UserService],
})
export class UserModule {}
