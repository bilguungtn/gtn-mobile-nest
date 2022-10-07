import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  app.use(helmet());
  await app.listen(port || 4001);
}
bootstrap();
