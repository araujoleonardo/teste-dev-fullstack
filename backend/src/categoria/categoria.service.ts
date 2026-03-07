import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaEntity } from './categoria.entity';
import { CriarCategoriaDto } from './dto/CriarCategoria.dto';
import { AtualizarCategoriaDto } from './dto/AtualizarCategoria.dto';
import { ListarCategoriasQueryDto } from './dto/ListarCategoriasQuery.dto';
import { PaginateResponse } from '../common/interfaces/paginate-response.interface';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(CategoriaEntity)
    private readonly categoriaRepository: Repository<CategoriaEntity>,
  ) {}

  async criar(dados: CriarCategoriaDto) {
    const categoria = new CategoriaEntity();
    categoria.nome = dados.nome;
    return await this.categoriaRepository.save(categoria);
  }

  async listar(queryParams: ListarCategoriasQueryDto): Promise<PaginateResponse<CategoriaEntity>> {
    const page = Math.max(Number(queryParams.page) || 1, 1);
    const pageSize = Math.max(Number(queryParams.page_size) || 10, 1);
    const search = queryParams.search?.trim();
    const direction =
      String(queryParams.direction).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const allowedOrderFields: Record<string, string> = {
      id: 'categoria.id',
      nome: 'categoria.nome',
    };

    const orderBy = allowedOrderFields[queryParams.field || 'id'] || 'categoria.id';

    const qb = this.categoriaRepository
      .createQueryBuilder('categoria')
      .leftJoinAndSelect('categoria.receitas', 'receitas');

    if (search) {
      qb.andWhere('categoria.nome LIKE :search', { search: `%${search}%` });
    }

    qb.orderBy(orderBy, direction)
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [itens, totalItens] = await qb.getManyAndCount();

    return {
      page,
      page_size: pageSize,
      total_itens: totalItens,
      total_pages: Math.ceil(totalItens / pageSize),
      itens,
    };
  }

  async buscarPorId(id: number) {
    const categoria = await this.categoriaRepository.findOne({
      where: { id },
      relations: ['receitas'],
    });

    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }
    return categoria;
  }

  async atualizar(id: number, dados: AtualizarCategoriaDto) {
    const categoria = await this.buscarPorId(id);
    Object.assign(categoria, dados);
    return await this.categoriaRepository.save(categoria);
  }

  async excluir(id: number) {
    const categoria = await this.buscarPorId(id);
    await this.categoriaRepository.remove(categoria);
    return { message: 'Categoria removida com sucesso' };
  }

  async listarDropdown() {
    return await this.categoriaRepository.find({
      select: ['id', 'nome'],
      order: { nome: 'ASC' },
    });
  }
}
