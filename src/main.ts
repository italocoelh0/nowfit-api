import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { urlencoded, json } from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

// Cria a instância Express (necessário para Vercel)
const expressApp = express();

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    { logger: ['error', 'warn'] }
  );
  
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

  await app.init();

  // Para desenvolvimento local
  if (process.env.NODE_ENV !== 'production') {
    await app.listen(8000);
    console.log('🚀 API rodando em http://localhost:8000');
  }

  return app;
}

// Para Vercel (serverless)
let cachedApp: any = null;

export default async function handler(req: any, res: any) {
  if (!cachedApp) {
    const app = await bootstrap();
    cachedApp = app.getHttpAdapter().getInstance();
  }
  return cachedApp(req, res);
}

// Para desenvolvimento local
if (require.main === module) {
  bootstrap();
}
