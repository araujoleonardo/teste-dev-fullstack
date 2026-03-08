import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaEntity } from './categoria.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';

// Helper para criar um mock de QueryBuilder
const createMockQb = (result: [any[], number] = [[], 0]) => {
  const qb = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue(result),
  } as unknown as SelectQueryBuilder<CategoriaEntity>;
  return qb;
};

describe('CategoriaService', () => {
  let service: CategoriaService;
  let repo: jest.Mocked<Repository<CategoriaEntity>>;

  const mockCategoria: CategoriaEntity = {
    id: 1,
    nome: 'Doces',
    receitas: [],
    criadoEm: new Date(),
    alteradoEm: new Date(),
  } as CategoriaEntity;

  beforeEach(async () => {
    const mockRepo = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriaService,
        { provide: getRepositoryToken(CategoriaEntity), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<CategoriaService>(CategoriaService);
    repo = module.get(getRepositoryToken(CategoriaEntity));
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  // criar
  describe('criar()', () => {
    it('deve criar e retornar uma categoria', async () => {
      repo.save.mockResolvedValue(mockCategoria);

      const result = await service.criar({ nome: 'Doces' });

      expect(repo.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCategoria);
    });
  });

  // listar
  describe('listar()', () => {
    it('deve retornar lista paginada de categorias', async () => {
      const qb = createMockQb([[mockCategoria], 1]);
      repo.createQueryBuilder.mockReturnValue(qb as any);

      const result = await service.listar({ page: 1, page_size: 10 });

      expect(result.total_itens).toBe(1);
      expect(result.itens).toHaveLength(1);
      expect(result.page).toBe(1);
    });

    it('deve usar page = 1 e page_size = 10 como padrão', async () => {
      const qb = createMockQb([[], 0]);
      repo.createQueryBuilder.mockReturnValue(qb as any);

      const result = await service.listar({});

      expect(result.page).toBe(1);
      expect(result.page_size).toBe(10);
    });

    it('deve aplicar filtro de busca quando search for fornecido', async () => {
      const qb = createMockQb([[mockCategoria], 1]);
      repo.createQueryBuilder.mockReturnValue(qb as any);

      await service.listar({ search: 'doce' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        'categoria.nome LIKE :search',
        { search: '%doce%' },
      );
    });
  });

  // buscarPorId
  describe('buscarPorId()', () => {
    it('deve retornar a categoria quando encontrada', async () => {
      repo.findOne.mockResolvedValue(mockCategoria);

      const result = await service.buscarPorId(1);

      expect(result).toEqual(mockCategoria);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['receitas'],
      });
    });

    it('deve lançar NotFoundException quando não encontrada', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.buscarPorId(99)).rejects.toThrow(NotFoundException);
    });
  });

  // atualizar
  describe('atualizar()', () => {
    it('deve atualizar e retornar a categoria', async () => {
      const categoriaAtualizada = { ...mockCategoria, nome: 'Salgados' };
      repo.findOne.mockResolvedValue(mockCategoria);
      repo.save.mockResolvedValue(categoriaAtualizada as CategoriaEntity);

      const result = await service.atualizar(1, { nome: 'Salgados' });

      expect(result.nome).toBe('Salgados');
      expect(repo.save).toHaveBeenCalledTimes(1);
    });

    it('deve lançar NotFoundException se categoria não existir', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.atualizar(99, { nome: 'X' })).rejects.toThrow(NotFoundException);
    });
  });

  // excluir
  describe('excluir()', () => {
    it('deve excluir a categoria e retornar mensagem', async () => {
      repo.findOne.mockResolvedValue(mockCategoria);
      repo.remove.mockResolvedValue(mockCategoria);

      const result = await service.excluir(1);

      expect(result).toEqual({ message: 'Categoria removida com sucesso' });
      expect(repo.remove).toHaveBeenCalledWith(mockCategoria);
    });

    it('deve lançar NotFoundException se categoria não existir', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.excluir(99)).rejects.toThrow(NotFoundException);
    });
  });

  // listarDropdown
  describe('listarDropdown()', () => {
    it('deve listar apenas id e nome, ordenados por nome', async () => {
      const dropdown = [
        { id: 2, nome: 'Bolos' },
        { id: 1, nome: 'Doces' },
      ] as CategoriaEntity[];
      repo.find.mockResolvedValue(dropdown);

      const result = await service.listarDropdown();

      expect(result).toHaveLength(2);
      expect(repo.find).toHaveBeenCalledWith({
        select: ['id', 'nome'],
        order: { nome: 'ASC' },
      });
    });
  });
});
