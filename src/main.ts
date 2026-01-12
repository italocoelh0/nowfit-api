import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {urlencoded, json} from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });
  
  app.use(json({limit: '16mb'}));
  app.use(urlencoded({limit: '16mb', extended: true}));

  // Habilita CORS para seu frontend React
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  const config = new DocumentBuilder()
    .setTitle('NowFit Payments API')
    .setDescription('API para integração com Stripe')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api'); // Todas as rotas começam com /api

  await app.listen(8000);
}
bootstrap();
