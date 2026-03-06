import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReceitaEntity } from './receita.entity';
import { CriarReceitaDto } from './dto/CriarReceita.dto';
import { AtualizarReceitaDto } from './dto/AtualizarReceita.dto';
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

  async listar() {
    return await this.receitaRepository.find({
      relations: ['categoria', 'usuario'],
    });
  }

  async buscarPorId(id: number) {
    const receita = await this.receitaRepository.findOne({
      where: { id },
      relations: ['categoria', 'usuario'],
    });
    if (!receita) {
      throw new NotFoundException('Receita não encontrada');
    }
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

