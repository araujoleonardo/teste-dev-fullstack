import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { ReceitaEntity } from './receita.entity';
import { CriarReceitaDto } from './dto/CriarReceita.dto';
import { AtualizarReceitaDto } from './dto/AtualizarReceita.dto';
import { ListarReceitasQueryDto } from './dto/ListarReceitasQuery.dto';
import { PaginateResponse } from '../common/interfaces/paginate-response.interface';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { CategoriaEntity } from '../categoria/categoria.entity';

@Injectable()
export class ReceitaService {
  constructor(
    @InjectRepository(ReceitaEntity)
    private readonly receitaRepository: Repository<ReceitaEntity>,
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
    @InjectRepository(CategoriaEntity)
    private readonly categoriaRepository: Repository<CategoriaEntity>,
  ) {}

  async criar(dados: CriarReceitaDto) {
    await this.validarRelacionamentos(dados.idUsuarios, dados.idCategorias);

    const receita = this.receitaRepository.create(dados);
    return await this.receitaRepository.save(receita);
  }

  private async validarRelacionamentos(idUsuario?: number, idCategoria?: number) {
    if (idUsuario) {
      const usuarioExiste = await this.usuarioRepository.exists({
        where: { id: idUsuario },
      });
      if (!usuarioExiste) {
        throw new NotFoundException(`Usuário informado não encontrado`);
      }
    }

    if (idCategoria) {
      const categoriaExiste = await this.categoriaRepository.exists({
        where: { id: idCategoria },
      });
      if (!categoriaExiste) {
        throw new NotFoundException(
          `Categoria informada não encontrada`,
        );
      }
    }
  }

  async listar(queryParams: ListarReceitasQueryDto): Promise<PaginateResponse<ReceitaEntity>> {
    const page = Math.max(Number(queryParams.page) || 1, 1);
    const pageSize = Math.max(Number(queryParams.page_size) || 10, 1);
    const search = queryParams.search?.trim();
    const direction =
      String(queryParams.direction).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const allowedOrderFields: Record<string, string> = {
      id: 'receita.id',
      nome: 'receita.nome',
      tempo_preparo: 'receita.tempoPreparoMinutos',
      porcoes: 'receita.porcoes',
      criado_em: 'receita.criado_em',
    };

    const orderBy = allowedOrderFields[queryParams.field || 'id'] || 'receita.id';

    const qb = this.receitaRepository
      .createQueryBuilder('receita')
      .leftJoinAndSelect('receita.categoria', 'categoria')
      .leftJoinAndSelect('receita.usuario', 'usuario');

    if (search) {
      qb.andWhere(
        new Brackets((subQb) => {
          subQb
            .where('receita.nome LIKE :search', { search: `%${search}%` })
            .orWhere('receita.ingredientes LIKE :search', { search: `%${search}%` });
        }),
      );
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
      itens: itens.map(r => {
        if (r.usuario) delete r.usuario.senha;
        return r;
      }),
    };
  }

  async buscarPorId(id: number) {
    const receita = await this.receitaRepository.findOne({
      where: { id },
      relations: ['categoria', 'usuario'],
    });
    if (!receita) {
      throw new NotFoundException('Receita não encontrada');
    }
    if (receita.usuario) delete receita.usuario.senha;
    return receita;
  }

  async atualizar(id: number, dados: AtualizarReceitaDto) {
    const receita = await this.buscarPorId(id);

    await this.validarRelacionamentos(dados.idUsuarios, dados.idCategorias);

    Object.assign(receita, dados);
    return await this.receitaRepository.save(receita);
  }

  async excluir(id: number) {
    const receita = await this.buscarPorId(id);
    await this.receitaRepository.remove(receita);
    return { message: 'Receita removida com sucesso' };
  }
}

