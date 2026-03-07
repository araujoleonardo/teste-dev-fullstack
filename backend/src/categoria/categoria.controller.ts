import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CriarCategoriaDto } from './dto/CriarCategoria.dto';
import { AtualizarCategoriaDto } from './dto/AtualizarCategoria.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ListarCategoriasQueryDto } from './dto/ListarCategoriasQuery.dto';

@Controller('categorias')
@UseGuards(JwtAuthGuard)
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  async criar(@Body() dados: CriarCategoriaDto) {
    const categoria = await this.categoriaService.criar(dados);
    return {
      categoria,
      message: 'Categoria criada com sucesso',
    };
  }

  @Get()
  async listar(@Query() queryParams: ListarCategoriasQueryDto) {
    return await this.categoriaService.listar(queryParams);
  }

  @Get('dropdown')
  async listarDropdown() {
    return await this.categoriaService.listarDropdown();
  }

  @Get(':id')
  async buscarPorId(@Param('id') id: number) {
    return await this.categoriaService.buscarPorId(id);
  }

  @Put(':id')
  async atualizar(
    @Param('id') id: number,
    @Body() dados: AtualizarCategoriaDto,
  ) {
    const categoria = await this.categoriaService.atualizar(id, dados);
    return {
      categoria,
      message: 'Categoria atualizada com sucesso',
    };
  }

  @Delete(':id')
  async excluir(@Param('id') id: number) {
    return await this.categoriaService.excluir(id);
  }
}
