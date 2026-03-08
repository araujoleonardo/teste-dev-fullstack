import { INestApplication, ValidationPipe, Global, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import request from 'supertest';
import { App } from 'supertest/types';

import { AuthModule } from '../src/auth/auth.module';
import { UsuarioModule } from '../src/usuario/usuario.module';
import { CategoriaModule } from '../src/categoria/categoria.module';
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

async function buildApp(): Promise<INestApplication<App>> {
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
    ],
  }).compile();

  const app = module.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  await app.init();
  return app;
}

describe('Categorias E2E', () => {
  let app: INestApplication<App>;
  let token: string;
  let categoriaId: number;

  beforeAll(async () => {
    app = await buildApp();

    await request(app.getHttpServer())
      .post('/usuarios')
      .send({ nome: 'Admin', login: 'admin', senha: 'Senha@123' });

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ login: 'admin', senha: 'Senha@123' });

    token = loginRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  // criar
  describe('POST /categorias', () => {
    it('deve criar categoria com sucesso (201)', async () => {
      const res = await request(app.getHttpServer())
        .post('/categorias')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Doces e Sobremesas' })
        .expect(201);

      expect(res.body).toMatchObject({ categoria: { id: expect.any(Number), nome: 'Doces e Sobremesas' } });
      categoriaId = res.body.categoria.id;
    });

    it('deve rejeitar sem autenticação (401)', async () => {
      await request(app.getHttpServer()).post('/categorias').send({ nome: 'Teste' }).expect(401);
    });

    it('deve rejeitar payload inválido sem nome (400)', async () => {
      await request(app.getHttpServer())
        .post('/categorias')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);
    });
  });

  // listar
  describe('GET /categorias', () => {
    it('deve retornar lista paginada (200)', async () => {
      const res = await request(app.getHttpServer())
        .get('/categorias')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toMatchObject({
        page: expect.any(Number),
        total_itens: expect.any(Number),
        itens: expect.any(Array),
      });
    });

    it('deve filtrar por busca (200)', async () => {
      const res = await request(app.getHttpServer())
        .get('/categorias?search=Doces')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.itens.length).toBeGreaterThanOrEqual(1);
    });

    it('deve rejeitar sem autenticação (401)', async () => {
      await request(app.getHttpServer()).get('/categorias').expect(401);
    });
  });

  // buscar por id
  describe('GET /categorias/:id', () => {
    it('deve retornar categoria pelo id (200)', async () => {
      const res = await request(app.getHttpServer())
        .get(`/categorias/${categoriaId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toMatchObject({ id: categoriaId, nome: 'Doces e Sobremesas' });
    });

    it('deve retornar 404 para id inexistente', async () => {
      await request(app.getHttpServer())
        .get('/categorias/99999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  // dropdown
  describe('GET /categorias/dropdown', () => {
    it('deve retornar array de id e nome (200)', async () => {
      const res = await request(app.getHttpServer())
        .get('/categorias/dropdown')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('nome');
      }
    });
  });

  // atualizar
  describe('PUT /categorias/:id', () => {
    it('deve atualizar categoria com sucesso (200)', async () => {
      const res = await request(app.getHttpServer())
        .put(`/categorias/${categoriaId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Bolos' })
        .expect(200);

      expect(res.body).toMatchObject({ categoria: { id: categoriaId, nome: 'Bolos' } });
    });

    it('deve retornar 404 para id inexistente', async () => {
      await request(app.getHttpServer())
        .put('/categorias/99999')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'X' })
        .expect(404);
    });

    it('deve rejeitar campo não permitido no body (400)', async () => {
      await request(app.getHttpServer())
        .put(`/categorias/${categoriaId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'X', campoInvalido: true })
        .expect(400);
    });
  });

  // excluir
  describe('DELETE /categorias/:id', () => {
    it('deve excluir categoria com sucesso (200)', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/categorias')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Para Excluir' });

      const idToDelete = createRes.body.categoria?.id ?? createRes.body.id;
      await request(app.getHttpServer())
        .delete(`/categorias/${idToDelete}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('deve retornar 404 para id inexistente', async () => {
      await request(app.getHttpServer())
        .delete('/categorias/99999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('deve rejeitar sem autenticação (401)', async () => {
      await request(app.getHttpServer()).delete(`/categorias/${categoriaId}`).expect(401);
    });
  });
});
