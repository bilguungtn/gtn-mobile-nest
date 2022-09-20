import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseStrategy } from '../config/supabase/supabase';
import { PassportModule } from '@nestjs/passport';
import { NestCrawlerModule } from 'nest-crawler';

@Module({
  imports: [PrismaModule, PassportModule, NestCrawlerModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, SupabaseStrategy],
  exports: [SupabaseStrategy],
})
export class AppModule {}
