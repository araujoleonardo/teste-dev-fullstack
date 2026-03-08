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
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CategoriaService } from './categoria.service';
import { CriarCategoriaDto } from './dto/CriarCategoria.dto';
import { AtualizarCategoriaDto } from './dto/AtualizarCategoria.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ListarCategoriasQueryDto } from './dto/ListarCategoriasQuery.dto';

@ApiTags('categorias')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categorias')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova categoria' })
  @ApiResponse({ status: 201, description: 'Categoria criada com sucesso' })
  async criar(@Body() dados: CriarCategoriaDto) {
    const categoria = await this.categoriaService.criar(dados);
    return {
      categoria,
      message: 'Categoria criada com sucesso',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar categorias com paginação e busca' })
  async listar(@Query() queryParams: ListarCategoriasQueryDto) {
    return await this.categoriaService.listar(queryParams);
  }

  @Get('dropdown')
  @ApiOperation({ summary: 'Listar categorias formatadas para dropdown (id, nome)' })
  async listarDropdown() {
    return await this.categoriaService.listarDropdown();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma categoria pelo ID' })
  @ApiResponse({ status: 200, description: 'Categoria encontrada' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async buscarPorId(@Param('id') id: number) {
    return await this.categoriaService.buscarPorId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma categoria existente' })
  @ApiResponse({ status: 200, description: 'Categoria atualizada com sucesso' })
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
  @ApiOperation({ summary: 'Excluir uma categoria' })
  @ApiResponse({ status: 200, description: 'Categoria removida com sucesso' })
  async excluir(@Param('id') id: number) {
    return await this.categoriaService.excluir(id);
  }
}
