import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsuarioService } from './usuario.service';
import { UsuarioEntity } from './usuario.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

const createMockQb = (result: [any[], number] = [[], 0]) =>
  ({
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue(result),
  }) as unknown as SelectQueryBuilder<UsuarioEntity>;

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repo: jest.Mocked<Repository<UsuarioEntity>>;

  const mockUsuario = {
    id: 1,
    nome: 'Leonardo',
    login: 'leo',
    senha: 'hashed_password',
    criadoEm: '2024-01-01',
    alteradoEm: '2024-01-01',
    receitas: [],
  } as unknown as UsuarioEntity;

  beforeEach(async () => {
    const mockRepo = {
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        { provide: getRepositoryToken(UsuarioEntity), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repo = module.get(getRepositoryToken(UsuarioEntity));
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  // criar
  describe('criar()', () => {
    it('deve criar um novo usuário com senha encriptada', async () => {
      repo.save.mockResolvedValue(mockUsuario as any);
      mockedBcrypt.hash.mockResolvedValue('hashed_password' as never);

      const result = await service.criar({
        nome: 'Leonardo',
        login: 'leo',
        senha: '123456',
      });

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('123456', 10);
      expect(repo.save).toHaveBeenCalledTimes(1);
      // A senha nao deve ser exposta na resposta
      expect(result).not.toHaveProperty('senha');
    });

    it('deve remover a senha do objeto retornado', async () => {
      repo.save.mockResolvedValue({ ...mockUsuario, senha: 'hashed' });

      const result = await service.criar({
        nome: 'Leo',
        login: 'leo',
        senha: '123456',
      });

      expect(result).not.toHaveProperty('senha');
    });
  });

  //listar
  describe('listar()', () => {
    it('deve retornar lista paginada de usuários sem senha', async () => {
      const qb = createMockQb([[{ ...mockUsuario }], 1]);
      repo.createQueryBuilder.mockReturnValue(qb as any);

      const result = await service.listar({ page: 1, page_size: 10 });

      expect(result.total_itens).toBe(1);
      expect(result.itens).toHaveLength(1);
      // A senha deve ser removida de cada registro
      expect(result.itens[0].senha).toBeUndefined();
    });

    it('deve usar page = 1 e page_size = 10 como padrão', async () => {
      const qb = createMockQb([[], 0]);
      repo.createQueryBuilder.mockReturnValue(qb as any);

      const result = await service.listar({});

      expect(result.page).toBe(1);
      expect(result.page_size).toBe(10);
    });

    it('deve calcular total_pages corretamente', async () => {
      const usuarios = Array(15).fill({ ...mockUsuario }) as UsuarioEntity[];
      const qb = createMockQb([usuarios, 15]);
      repo.createQueryBuilder.mockReturnValue(qb as any);

      const result = await service.listar({ page: 1, page_size: 10 });

      expect(result.total_pages).toBe(2);
    });
  });
});
