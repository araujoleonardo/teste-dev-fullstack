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
import { ReceitaService } from './receita.service';
import { CriarReceitaDto } from './dto/CriarReceita.dto';
import { AtualizarReceitaDto } from './dto/AtualizarReceita.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ListarReceitasQueryDto } from './dto/ListarReceitasQuery.dto';

@ApiTags('receitas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('receitas')
export class ReceitaController {
  constructor(private readonly receitaService: ReceitaService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova receita' })
  @ApiResponse({ status: 201, description: 'Receita criada com sucesso' })
  async criar(@Body() dados: CriarReceitaDto) {
    const data = await this.receitaService.criar(dados);
    return {
      data,
      message: 'Receita criada com sucesso',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar receitas com paginação e busca' })
  async listar(@Query() queryParams: ListarReceitasQueryDto) {
    return await this.receitaService.listar(queryParams);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma receita pelo ID' })
  @ApiResponse({ status: 200, description: 'Receita encontrada' })
  @ApiResponse({ status: 404, description: 'Receita não encontrada' })
  async buscarPorId(@Param('id') id: number) {
    return await this.receitaService.buscarPorId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma receita existente' })
  @ApiResponse({ status: 200, description: 'Receita atualizada com sucesso' })
  async atualizar(
    @Param('id') id: number,
    @Body() dados: AtualizarReceitaDto,
  ) {
    const data = await this.receitaService.atualizar(id, dados);
    return {
      data,
      message: 'Receita atualizada com sucesso',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma receita' })
  @ApiResponse({ status: 200, description: 'Receita removida com sucesso' })
  async excluir(@Param('id') id: number) {
    return await this.receitaService.excluir(id);
  }
}
