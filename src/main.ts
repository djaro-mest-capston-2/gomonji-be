import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const environment = configService.get('environment');
  const appPort = configService.get('app.port');
  const appHost = configService.get('app.host');
  const appHostname = configService.get('app.hostname');

  const swaggerUser = configService.get('swagger.users');
  if (swaggerUser) {
    app.use(
      ['/swagger', '/swagger-json'],
      basicAuth({
        challenge: true,
        users: swaggerUser,
      }),
    );
  }

  const initSwagger = (app: INestApplication, serverUrl: string) => {
    const config = new DocumentBuilder()
      .setTitle('Gomonji BE API Documentation')
      .setDescription(
        'Gomonji is a product for travel agencies. It enables them to setup account, create and market trips.',
      )
      .setVersion('1.0')
      .addServer(serverUrl)
      .addBearerAuth()
      .addTag('Gomonji RESTful API Documentation')
      .build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('/swagger', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  };

  if (environment !== 'production') {
    initSwagger(app, appHost);
  }

  // Validation pipe
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(appPort, appHostname);
}
bootstrap();
