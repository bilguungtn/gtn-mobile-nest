import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from '../config/configuration';
import { validationSchema } from '../config/env.validation';
import { PrismaService, PrismaServiceOld } from './prisma.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env`,
      load: [configuration],
      isGlobal: true,
      validationSchema,
    }),
    ConfigModule,
  ],
  providers: [PrismaService, PrismaServiceOld],
})
export class PrismaModule {}
