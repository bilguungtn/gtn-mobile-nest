import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from '../config/configuration';
import { validationSchema } from '../config/env.validation';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV}`,
      load: [configuration],
      isGlobal: true,
      validationSchema,
    }),
    ConfigModule,
  ],
  providers: [PrismaService],
})
export class PrismaModule {}
