import { Module } from '@nestjs/common';
import { PrismaServiceOld } from 'prisma/prisma.service';
import { UserService } from 'src/modules/user/user.service';

@Module({
  providers: [PrismaServiceOld, UserService],
})
export class UserModule {}
