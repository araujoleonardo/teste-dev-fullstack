import { INestApplication, ValidationPipe, Global, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import request from 'supertest';
import { App } from 'supertest/types';

import { AuthModule } from '../src/auth/auth.module';
import { UsuarioModule } from '../src/usuario/usuario.module';
import { CategoriaModule } from '../src/categoria/categoria.module';
import { ReceitaModule } from '../src/receita/receita.module';
import { UsuarioEntity } from '../src/usuario/usuario.entity';
import { ReceitaEntity } from '../src/receita/receita.entity';
import { CategoriaEntity } from '../src/categoria/categoria.entity';
import { RedisService } from '../src/redis/redis.service';

const mockRedisService = {
  set: jest.fn().mockResolvedValue(undefined),
  get: jest.fn().mockResolvedValue(null),
  del: jest.fn().mockResolvedValue(undefined),
  exists: jest.fn().mockResolvedValue(false),
};

@Global()
@Module({
  providers: [{ provide: RedisService, useValue: mockRedisService }],
  exports: [RedisService],
})
class MockRedisModule {}

describe('Sanidade da Aplicação (E2E)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [UsuarioEntity, CategoriaEntity, ReceitaEntity],
          synchronize: true,
          dropSchema: true,
        }),
        MockRedisModule,
        AuthModule,
        UsuarioModule,
        CategoriaModule,
        ReceitaModule,
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('rota inexistente deve retornar 404', async () => {
    await request(app.getHttpServer()).get('/rota-que-nao-existe').expect(404);
  });

  it('endpoints protegidos sem token devem retornar 401', async () => {
    await request(app.getHttpServer()).get('/categorias').expect(401);
    await request(app.getHttpServer()).get('/receitas').expect(401);
  });

  it('POST /auth/login sem body deve retornar 400', async () => {
    await request(app.getHttpServer()).post('/auth/login').send({}).expect(400);
  });

  it('POST /usuarios sem body deve retornar 400', async () => {
    await request(app.getHttpServer()).post('/usuarios').send({}).expect(400);
  });
});
