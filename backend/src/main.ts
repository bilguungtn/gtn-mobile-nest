import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from 'src/modules/app/app.module';
import { CustomValidationPipe } from './common/pipes/validation.pipe';
import { INestApplication } from '@nestjs/common';

const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Title')
    .setDescription('Nest Mobile API description')
    .setVersion('1.0')
    .addBasicAuth(
      {
        type: 'http',
        scheme: 'basic',
      },
      'basic',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  app.use(helmet());

  app.useGlobalPipes(new CustomValidationPipe());

  // swagger
  setupSwagger(app);

  await app.listen(port || 4001);
}
bootstrap();
