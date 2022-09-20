import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaClientInitializationError } from '@prisma/client/runtime';
// import { CommonException } from '../src/common/exceptions/common.exception';
import { NotConnectedDBException } from './exceptions/not-connected-db.exception';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      if (error instanceof PrismaClientInitializationError) {
        throw new NotConnectedDBException(error);
      }
      throw new error();
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch (error) {
      throw new error();
    }
  }
}
