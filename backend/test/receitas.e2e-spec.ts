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
      ReceitaModule,
    ],
  }).compile();

  const app = module.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  await app.init();
  return app;
}

describe('Receitas E2E', () => {
  let app: INestApplication<App>;
  let token: string;
  let usuarioId: number;
  let categoriaId: number;
  let receitaId: number;

  beforeAll(async () => {
    app = await buildApp();

    // Criar usuário
    const userRes = await request(app.getHttpServer())
      .post('/usuarios')
      .send({ nome: 'Chef Teste', login: 'chefteste', senha: 'Senha@123' });
    usuarioId = userRes.body.usuario.id;

    // Login
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ login: 'chefteste', senha: 'Senha@123' });
    token = loginRes.body.access_token;

    // Criar categoria
    const catRes = await request(app.getHttpServer())
      .post('/categorias')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Bolos' });
    categoriaId = catRes.body.categoria.id;
  });

  afterAll(async () => {
    await app.close();
  });

  // criar
  describe('POST /receitas', () => {
    it('deve criar receita com sucesso (201)', async () => {
      const res = await request(app.getHttpServer())
        .post('/receitas')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: 'Bolo de Cenoura',
          tempoPreparoMinutos: 60,
          porcoes: 10,
          modoPreparo: 'Bata tudo no liquidificador e asse por 40 minutos.',
          ingredientes: '3 cenouras, 3 ovos, 1 xícara de óleo.',
          idUsuarios: usuarioId,
          idCategorias: categoriaId,
        })
        .expect(201);

      expect(res.body).toMatchObject({
        data: {
          id: expect.any(Number),
          nome: 'Bolo de Cenoura',
          tempoPreparoMinutos: 60,
          porcoes: 10,
        },
      });
      receitaId = res.body.data.id;
    });

    it('deve rejeitar sem autenticação (401)', async () => {
      await request(app.getHttpServer())
        .post('/receitas')
        .send({ nome: 'Teste' })
        .expect(401);
    });

    it('deve rejeitar payload sem nome (400)', async () => {
      await request(app.getHttpServer())
        .post('/receitas')
        .set('Authorization', `Bearer ${token}`)
        .send({
          tempoPreparoMinutos: 60,
          porcoes: 10,
          modoPreparo: 'modo',
          ingredientes: 'ingredientes',
          idUsuarios: usuarioId,
        })
        .expect(400);
    });

    it('deve rejeitar usuário inexistente (404)', async () => {
      await request(app.getHttpServer())
        .post('/receitas')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: 'Teste',
          tempoPreparoMinutos: 30,
          porcoes: 4,
          modoPreparo: 'modo',
          ingredientes: 'ings',
          idUsuarios: 99999,
          idCategorias: categoriaId,
        })
        .expect(404);
    });

    it('deve rejeitar categoria inexistente (404)', async () => {
      await request(app.getHttpServer())
        .post('/receitas')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: 'Teste',
          tempoPreparoMinutos: 30,
          porcoes: 4,
          modoPreparo: 'modo',
          ingredientes: 'ings',
          idUsuarios: usuarioId,
          idCategorias: 99999,
        })
        .expect(404);
    });
  });

  // listar
  describe('GET /receitas', () => {
    it('deve retornar lista paginada (200)', async () => {
      const res = await request(app.getHttpServer())
        .get('/receitas')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toMatchObject({
        page: expect.any(Number),
        total_itens: expect.any(Number),
        itens: expect.any(Array),
      });
    });

    it('deve filtrar por busca no nome (200)', async () => {
      const res = await request(app.getHttpServer())
        .get('/receitas?search=Bolo')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.itens.length).toBeGreaterThanOrEqual(1);
    });

    it('deve filtrar por busca nos ingredientes (200)', async () => {
      const res = await request(app.getHttpServer())
        .get('/receitas?search=cenoura')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.itens.length).toBeGreaterThanOrEqual(1);
    });

    it('deve rejeitar sem autenticação (401)', async () => {
      await request(app.getHttpServer()).get('/receitas').expect(401);
    });
  });

  // buscar por id
  describe('GET /receitas/:id', () => {
    it('deve retornar a receita pelo id (200)', async () => {
      const res = await request(app.getHttpServer())
        .get(`/receitas/${receitaId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toMatchObject({ id: receitaId, nome: 'Bolo de Cenoura' });
      expect(res.body.usuario?.senha).toBeUndefined();
    });

    it('deve retornar 404 para id inexistente', async () => {
      await request(app.getHttpServer())
        .get('/receitas/99999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  // atualizar
  describe('PUT /receitas/:id', () => {
    it('deve atualizar a receita com sucesso (200)', async () => {
      const res = await request(app.getHttpServer())
        .put(`/receitas/${receitaId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Bolo de Cenoura com Cobertura' })
        .expect(200);

      expect(res.body.data).toMatchObject({ nome: 'Bolo de Cenoura com Cobertura' });
    });

    it('deve rejeitar campo "id" no body (400)', async () => {
      await request(app.getHttpServer())
        .put(`/receitas/${receitaId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ id: receitaId, nome: 'Teste' })
        .expect(400);
    });

    it('deve retornar 404 para id inexistente', async () => {
      await request(app.getHttpServer())
        .put('/receitas/99999')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'X' })
        .expect(404);
    });

    it('deve rejeitar sem autenticação (401)', async () => {
      await request(app.getHttpServer())
        .put(`/receitas/${receitaId}`)
        .send({ nome: 'Test' })
        .expect(401);
    });
  });

  // excluir
  describe('DELETE /receitas/:id', () => {
    it('deve excluir a receita com sucesso (200)', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/receitas')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: 'Para Excluir',
          tempoPreparoMinutos: 10,
          porcoes: 2,
          modoPreparo: 'modo',
          ingredientes: 'ings',
          idUsuarios: usuarioId,
          idCategorias: categoriaId,
        });

      const idToDelete = createRes.body.data?.id ?? createRes.body.id;
      await request(app.getHttpServer())
        .delete(`/receitas/${idToDelete}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('deve retornar 404 para id inexistente', async () => {
      await request(app.getHttpServer())
        .delete('/receitas/99999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('deve rejeitar sem autenticação (401)', async () => {
      await request(app.getHttpServer()).delete(`/receitas/${receitaId}`).expect(401);
    });
  });
});
