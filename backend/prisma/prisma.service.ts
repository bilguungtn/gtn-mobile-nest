import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient as PrismaClient2 } from '@prisma/client-2';
import { PrismaClient } from '@prisma/client';
import { PrismaClientInitializationError } from '@prisma/client/runtime';
import { CommonException } from '../src/common/exceptions/common.exception';
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
      throw new CommonException(error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch (error) {
      throw new CommonException(error);
    }
  }
}

@Injectable()
export class PrismaServiceOld
  extends PrismaClient2
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      if (error instanceof PrismaClientInitializationError) {
        throw new NotConnectedDBException(error);
      }
      throw new CommonException(error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch (error) {
      throw new CommonException(error);
    }
  }
}
