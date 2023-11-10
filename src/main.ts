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
  // const urlOrigin = 'http://localhost:3000';
  const urlOrigin = 'https://frontend-olimpo.onrender.com';

  // Configuración de encabezados CORS
  app.enableCors({
    origin: urlOrigin, // Cambia esto por el origen correcto
    methods: 'GET, POST, PUT, DELETE, PATCH',
    allowedHeaders:
      'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  });
  await app.listen(3001);
}
bootstrap();
