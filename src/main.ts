import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const url = 'http://localhost:3000';
  // Configuración de encabezados CORS
  app.enableCors({
    origin: url,
    methods: 'GET, POST, PUT, DELETE, PATCH',
    allowedHeaders:
      'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  });
  await app.listen(3001);
}
bootstrap();
