import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { RedisService } from '../redis/redis.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let usuarioRepo: jest.Mocked<Repository<UsuarioEntity>>;
  let jwtService: jest.Mocked<JwtService>;
  let redisService: jest.Mocked<RedisService>;

  const mockUsuario = {
    id: 1,
    nome: 'Leonardo',
    login: 'leonardo',
    senha: '$2b$10$hashedpassword',
    criadoEm: '2024-01-01',
    alteradoEm: '2024-01-01',
    receitas: [],
  } as unknown as UsuarioEntity;

  const mockToken = 'jwt.token.value';
  const mockDecodedToken = { exp: Math.floor(Date.now() / 1000) + 86400 };

  beforeEach(async () => {
    const mockUsuarioRepo = { findOne: jest.fn() };
    const mockJwtService = { sign: jest.fn(), decode: jest.fn() };
    const mockRedisService = { set: jest.fn(), exists: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(UsuarioEntity), useValue: mockUsuarioRepo },
        { provide: JwtService, useValue: mockJwtService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usuarioRepo = module.get(getRepositoryToken(UsuarioEntity));
    jwtService = module.get(JwtService);
    redisService = module.get(RedisService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  // login
  describe('login()', () => {
    it('deve retornar access_token, expires_in e dados do usuário no login com sucesso', async () => {
      usuarioRepo.findOne.mockResolvedValue(mockUsuario);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      jwtService.sign.mockReturnValue(mockToken);
      jwtService.decode.mockReturnValue(mockDecodedToken);

      const result = await service.login({ login: 'leonardo', senha: '123456' });

      expect(result.access_token).toBe(mockToken);
      expect(result.expires_in).toBeGreaterThan(0);
      expect(result.usuario).toEqual({ id: 1, nome: 'Leonardo', login: 'leonardo' });
    });

    it('deve lançar UnauthorizedException quando usuário não existir', async () => {
      usuarioRepo.findOne.mockResolvedValue(null);

      await expect(service.login({ login: 'naoexiste', senha: '123456' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar UnauthorizedException quando a senha estiver errada', async () => {
      usuarioRepo.findOne.mockResolvedValue(mockUsuario);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      await expect(service.login({ login: 'leonardo', senha: 'errada' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  // logout

  describe('logout()', () => {
    it('deve colocar o token na blacklist do Redis', async () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600;
      jwtService.decode.mockReturnValue({ exp: futureExp });
      redisService.set.mockResolvedValue(undefined);

      await service.logout('valid.token.here');

      expect(redisService.set).toHaveBeenCalledWith(
        'blacklist:valid.token.here',
        '1',
        expect.any(Number),
      );
    });

    it('não deve chamar Redis quando token não tem expiração', async () => {
      jwtService.decode.mockReturnValue(null);

      await service.logout('token.invalido');

      expect(redisService.set).not.toHaveBeenCalled();
    });

    it('não deve chamar Redis quando o token já expirou', async () => {
      const pastExp = Math.floor(Date.now() / 1000) - 100;
      jwtService.decode.mockReturnValue({ exp: pastExp });

      await service.logout('token.expirado');

      expect(redisService.set).not.toHaveBeenCalled();
    });
  });

  // Token revogado
  describe('isTokenRevogado()', () => {
    it('deve retornar true quando o token estiver na blacklist', async () => {
      redisService.exists.mockResolvedValue(true);

      const result = await service.isTokenRevogado('token.revogado');

      expect(result).toBe(true);
    });

    it('deve retornar false quando o token não estiver na blacklist', async () => {
      redisService.exists.mockResolvedValue(false);

      const result = await service.isTokenRevogado('token.valido');

      expect(result).toBe(false);
    });
  });
});
