import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
  LogLevel,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import basicAuth from 'express-basic-auth';
import { PrismaService } from './common/database/prisma.service';
import { ErrorsInterceptor } from './common/interceptors/errors.interceptor';
import { RequestInterceptor } from './common/interceptors/request.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

const getLogLevels = () => {
  const levels = process.env.LOG_LEVELS?.split(',');

  return !levels?.length ? false : (levels as LogLevel[]);
};

async function bootstrap() {
    const logLevels = getLogLevels();
    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
      logger: logLevels,
    });
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
        .setTitle('Gomonji')
        .setDescription(
          'Gomonji, A platform for travel agencies',
        )
        .setVersion('1.0')
        .addServer(serverUrl)
        .addBearerAuth()
        .addTag(
          'Gomonji, Gomonji, A platform for travel agencies',
        )
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
  
    const prismaService = app.get(PrismaService);
    await prismaService.enableShutdownHooks(app);
  
    app.setGlobalPrefix(configService.get('APP_VERSION'));
    app.useGlobalInterceptors(
      new RequestInterceptor(),
      new ResponseInterceptor(),
      new ErrorsInterceptor(),
    );
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        validationError: {
          target: false,
          value: false,
        },
        exceptionFactory: (validationErrors: ValidationError[] = []) =>
          new BadRequestException(
            validationErrors.reduce(
              (errorObj, validationList) => ({
                ...errorObj,
                [validationList.property]: validationList,
              }),
              {},
            ),
          ),
      }),
    );
  
    // app.useLogger(app.get(Logger));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(cookieParser());
  
    // app.enableCors();
    const allowedOrigins = [
      /^(https:\/\/([^\.]*\.)?ngrok\.io)$/i,
      /^(https:\/\/([^\.]*\.)?amplifyapp\.com)$/i,
      'https://localhost:4200',
      'http://localhost:3000',
      'http://localhost:5000',
    ];
    const allowedOriginsProd = [
      'https://book.octodoc.com',
      'http://localhost:5000',
    ];
    const origins =
      environment === 'production' ? allowedOriginsProd : allowedOrigins;
  
    app.enableCors({
      origin: origins,
      credentials: true,
    });
  
    await app.listen(appPort, appHostname);
  }

bootstrap();
