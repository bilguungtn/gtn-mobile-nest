import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassportModule } from '@nestjs/passport';
import { NestCrawlerModule } from 'nest-crawler';
import { UserModule } from './user/user.module';

@Module({
  imports: [PrismaModule, PassportModule, NestCrawlerModule, UserModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [],
})
export class AppModule {}
