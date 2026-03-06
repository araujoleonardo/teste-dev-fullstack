import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaEntity } from './categoria.entity';
import { CriarCategoriaDto } from './dto/CriarCategoria.dto';
import { AtualizarCategoriaDto } from './dto/AtualizarCategoria.dto';

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

  async listar() {
    return await this.categoriaRepository.find({
      relations: ['receitas'],
    });
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
}
