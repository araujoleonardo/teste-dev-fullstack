import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { AuthModule } from '../src/auth/auth.module';
import { UsuarioModule } from '../src/usuario/usuario.module';
import { UsuarioEntity } from '../src/usuario/usuario.entity';
import { ReceitaEntity } from '../src/receita/receita.entity';
import { CategoriaEntity } from '../src/categoria/categoria.entity';
import { RedisService } from '../src/redis/redis.service';

// Módulo Redis falso global
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
    ],
  }).compile();

  const app = module.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  await app.init();
  return app;
}

describe('Auth + Usuário E2E', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  const usuarioTeste = {
    nome: 'Leonardo Araujo',
    login: 'leonardo',
    senha: 'Senha@123',
  };

  let tokenJwt: string;

  // usuarios
  describe('POST /usuarios', () => {
    it('deve criar um novo usuário com sucesso (201)', async () => {
      const res = await request(app.getHttpServer())
        .post('/usuarios')
        .send(usuarioTeste)
        .expect(201);

      expect(res.body).toMatchObject({
        usuario: {
          id: expect.any(Number),
          nome: usuarioTeste.nome,
          login: usuarioTeste.login,
        },
      });
      expect(res.body.usuario).not.toHaveProperty('senha');
    });

    it('deve falhar ao criar usuário sem dados obrigatórios (400)', async () => {
      const res = await request(app.getHttpServer())
        .post('/usuarios')
        .send({})
        .expect(400);

      expect(res.body).toHaveProperty('message');
    });

    it('deve falhar ao criar usuário com login duplicado (500 UNIQUE constraint)', async () => {
      const res = await request(app.getHttpServer())
        .post('/usuarios')
        .send(usuarioTeste);

      // banco lança UNIQUE constraint como 500
      expect([400, 409, 500]).toContain(res.status);
    });
  });

  // login
  describe('POST /auth/login', () => {
    it('deve fazer login e retornar JWT com expires_in (201)', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ login: usuarioTeste.login, senha: usuarioTeste.senha })
        .expect(201);

      expect(res.body).toMatchObject({
        access_token: expect.any(String),
        expires_in: expect.any(Number),
        usuario: {
          id: expect.any(Number),
          nome: usuarioTeste.nome,
          login: usuarioTeste.login,
        },
      });

      tokenJwt = res.body.access_token;
    });

    it('deve rejeitar login com senha incorreta (401)', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ login: usuarioTeste.login, senha: 'senha_errada' })
        .expect(401);

      expect(res.body.message).toContain('Credenciais inválidas');
    });

    it('deve rejeitar login com usuário inexistente (401)', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ login: 'nao_existe', senha: '123456' })
        .expect(401);
    });

    it('deve rejeitar login sem campos obrigatórios (400)', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(400);
    });
  });

  // me
  describe('GET /auth/me', () => {
    it('deve retornar dados do usuário autenticado (200)', async () => {
      const res = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${tokenJwt}`)
        .expect(200);

      expect(res.body).toMatchObject({
        login: usuarioTeste.login,
        nome: usuarioTeste.nome,
      });
    });

    it('deve rejeitar requisição sem token (401)', async () => {
      await request(app.getHttpServer()).get('/auth/me').expect(401);
    });

    it('deve rejeitar requisição com token inválido (401)', async () => {
      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer token.invalido.aqui')
        .expect(401);
    });
  });

  // logout
  describe('POST /auth/logout', () => {
    it('deve fazer logout com sucesso (201)', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${tokenJwt}`)
        .expect(201);

      expect(res.body).toMatchObject({ message: 'Logout realizado com sucesso' });
    });

    it('deve rejeitar logout sem token (401)', async () => {
      await request(app.getHttpServer()).post('/auth/logout').expect(401);
    });
  });
});
