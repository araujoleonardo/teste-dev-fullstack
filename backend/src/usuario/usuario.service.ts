import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { UsuarioEntity } from './usuario.entity';
import { ListarUsuariosQueryDto } from './dto/listar-usuarios-query.dto';
import { PaginateResponse } from '../common/interfaces/paginate-response.interface';
import * as bcrypt from 'bcrypt';
import { CriarUsuarioDto } from './dto/CriarUsuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  async criar(usuario: CriarUsuarioDto) {
    const usuarioEntity = new UsuarioEntity();

    usuarioEntity.nome = usuario.nome;
    usuarioEntity.login = usuario.login;
    usuarioEntity.senha = await bcrypt.hash(usuario.senha, 10);

    const { senha: _, ...resp } = await this.usuarioRepository.save(usuarioEntity);
    return resp;
  }

  async listar(queryParams: ListarUsuariosQueryDto): Promise<PaginateResponse<UsuarioEntity>> {
    const page = Math.max(Number(queryParams.page) || 1, 1);
    const pageSize = Math.max(Number(queryParams.page_size) || 10, 1);
    const search = queryParams.search?.trim();
    const direction =
      String(queryParams.direction).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const allowedOrderFields: Record<string, string> = {
      id: 'usuario.id',
      nome: 'usuario.nome',
      login: 'usuario.login',
      criado_em: 'usuario.criadoEm',
      alterado_em: 'usuario.alteradoEm',
    };

    const orderBy = allowedOrderFields[queryParams.field || 'id'] || 'usuario.id';

    const qb = this.usuarioRepository.createQueryBuilder('usuario');

    if (search) {
      qb.andWhere(
        new Brackets((subQb) => {
          subQb
            .where('usuario.nome LIKE :search', { search: `%${search}%` })
            .orWhere('usuario.login LIKE :search', { search: `%${search}%` });
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
      itens: itens.map(u => {
        delete u.senha;
        return u;
      }),
    };
  }
}
