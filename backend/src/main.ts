import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Configuracao do swagger
  const config = new DocumentBuilder()
    .setTitle('MasterCheff API')
    .setDescription('Documentação detalhada da API do sistema MasterCheff')
    .setVersion('1.0')
    .addTag('auth', 'Autenticação e Sessão')
    .addTag('categorias', 'Gestão de Categorias')
    .addTag('receitas', 'Gestão de Receitas')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const messages = errors.reduce((acc, error) => {
          acc[error.property] = Object.values(error.constraints || {});
          return acc;
        }, {});
        return new BadRequestException({ errors: messages });
      },
    }),
  );
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
