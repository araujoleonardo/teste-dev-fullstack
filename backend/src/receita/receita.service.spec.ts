import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ReceitaService } from './receita.service';
import { ReceitaEntity } from './receita.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';

const createMockQb = (result: [any[], number] = [[], 0]) =>
  ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue(result),
  }) as unknown as SelectQueryBuilder<ReceitaEntity>;

describe('ReceitaService', () => {
  let service: ReceitaService;
  let receitaRepo: jest.Mocked<Repository<ReceitaEntity>>;
  let usuarioRepo: jest.Mocked<Repository<UsuarioEntity>>;
  let categoriaRepo: jest.Mocked<Repository<CategoriaEntity>>;

  const mockReceita = {
    id: 1,
    nome: 'Pudim',
    tempoPreparoMinutos: 60,
    porcoes: 8,
    modoPreparo: 'Bata tudo e leve ao forno.',
    ingredientes: 'Leite condensado, ovos, caramelo.',
    idUsuarios: 1,
    idCategorias: 1,
    categoria: { id: 1, nome: 'Doces' } as CategoriaEntity,
    usuario: { id: 1, nome: 'Chef', login: 'chef', senha: 'hash', receitas: [] } as unknown as UsuarioEntity,
    criadoEm: '2024-01-01',
    alteradoEm: '2024-01-01',
  } as unknown as ReceitaEntity;

  beforeEach(async () => {
    const mockReceitaRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };
    const mockUsuarioRepo = { exists: jest.fn() };
    const mockCategoriaRepo = { exists: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceitaService,
        { provide: getRepositoryToken(ReceitaEntity), useValue: mockReceitaRepo },
        { provide: getRepositoryToken(UsuarioEntity), useValue: mockUsuarioRepo },
        { provide: getRepositoryToken(CategoriaEntity), useValue: mockCategoriaRepo },
      ],
    }).compile();

    service = module.get<ReceitaService>(ReceitaService);
    receitaRepo = module.get(getRepositoryToken(ReceitaEntity));
    usuarioRepo = module.get(getRepositoryToken(UsuarioEntity));
    categoriaRepo = module.get(getRepositoryToken(CategoriaEntity));
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  // criar
  describe('criar()', () => {
    const dto = {
      nome: 'Pudim',
      tempoPreparoMinutos: 60,
      porcoes: 8,
      modoPreparo: 'Bata tudo...',
      ingredientes: 'Leite, ovos...',
      idUsuarios: 1,
      idCategorias: 1,
    };

    it('deve criar e retornar a receita', async () => {
      usuarioRepo.exists.mockResolvedValue(true);
      categoriaRepo.exists.mockResolvedValue(true);
      receitaRepo.create.mockReturnValue(mockReceita);
      receitaRepo.save.mockResolvedValue(mockReceita);

      const result = await service.criar(dto);

      expect(result).toEqual(mockReceita);
      expect(receitaRepo.save).toHaveBeenCalledTimes(1);
    });

    it('deve lançar NotFoundException se usuário não existir', async () => {
      usuarioRepo.exists.mockResolvedValue(false);

      await expect(service.criar(dto)).rejects.toThrow(NotFoundException);
    });

    it('deve lançar NotFoundException se categoria não existir', async () => {
      usuarioRepo.exists.mockResolvedValue(true);
      categoriaRepo.exists.mockResolvedValue(false);

      await expect(service.criar(dto)).rejects.toThrow(NotFoundException);
    });
  });

  // listar
  describe('listar()', () => {
    it('deve retornar lista paginada', async () => {
      const receitaSemSenha = { ...mockReceita };
      const qb = createMockQb([[receitaSemSenha], 1]);
      receitaRepo.createQueryBuilder.mockReturnValue(qb as any);

      const result = await service.listar({ page: 1, page_size: 10 });

      expect(result.total_itens).toBe(1);
      expect(result.itens).toHaveLength(1);
      // Garante que a senha do usuário é removida
      expect(result.itens[0].usuario?.senha).toBeUndefined();
    });

    it('deve usar valores padrão quando page/page_size não forem informados', async () => {
      const qb = createMockQb([[], 0]);
      receitaRepo.createQueryBuilder.mockReturnValue(qb as any);

      const result = await service.listar({});

      expect(result.page).toBe(1);
      expect(result.page_size).toBe(10);
    });
  });

  //buscarPorId
  describe('buscarPorId()', () => {
    it('deve retornar a receita sem a senha do usuário', async () => {
      receitaRepo.findOne.mockResolvedValue({ ...mockReceita });

      const result = await service.buscarPorId(1);

      expect(result.nome).toBe('Pudim');
      expect(result.usuario?.senha).toBeUndefined();
    });

    it('deve lançar NotFoundException quando não encontrada', async () => {
      receitaRepo.findOne.mockResolvedValue(null);

      await expect(service.buscarPorId(99)).rejects.toThrow(NotFoundException);
    });
  });

  // atualizar
  describe('atualizar()', () => {
    it('deve atualizar e retornar a receita', async () => {
      receitaRepo.findOne.mockResolvedValue({ ...mockReceita });
      usuarioRepo.exists.mockResolvedValue(true);
      categoriaRepo.exists.mockResolvedValue(true);
      receitaRepo.save.mockResolvedValue({ ...mockReceita, nome: 'Pudim de Coco' });

      const result = await service.atualizar(1, {
        nome: 'Pudim de Coco',
        idUsuarios: 1,
        idCategorias: 1,
      });

      expect(result.nome).toBe('Pudim de Coco');
    });

    it('deve lançar NotFoundException se receita não existir', async () => {
      receitaRepo.findOne.mockResolvedValue(null);

      await expect(service.atualizar(99, {})).rejects.toThrow(NotFoundException);
    });
  });

  // excluir
  describe('excluir()', () => {
    it('deve excluir a receita e retornar mensagem', async () => {
      receitaRepo.findOne.mockResolvedValue({ ...mockReceita });
      receitaRepo.remove.mockResolvedValue(mockReceita);

      const result = await service.excluir(1);

      expect(result).toEqual({ message: 'Receita removida com sucesso' });
    });

    it('deve lançar NotFoundException se receita não existir', async () => {
      receitaRepo.findOne.mockResolvedValue(null);

      await expect(service.excluir(99)).rejects.toThrow(NotFoundException);
    });
  });
});
