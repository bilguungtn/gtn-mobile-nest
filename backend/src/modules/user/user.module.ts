import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'src/modules/user/user.service';

@Module({
  providers: [PrismaService, UserService],
})
export class UserModule {}
