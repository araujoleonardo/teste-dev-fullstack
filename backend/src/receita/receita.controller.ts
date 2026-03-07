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
import { ReceitaService } from './receita.service';
import { CriarReceitaDto } from './dto/CriarReceita.dto';
import { AtualizarReceitaDto } from './dto/AtualizarReceita.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ListarReceitasQueryDto } from './dto/ListarReceitasQuery.dto';

@Controller('receitas')
@UseGuards(JwtAuthGuard)
export class ReceitaController {
  constructor(private readonly receitaService: ReceitaService) {}

  @Post()
  async criar(@Body() dados: CriarReceitaDto) {
    const data = await this.receitaService.criar(dados);
    return {
      data,
      message: 'Receita criada com sucesso',
    };
  }

  @Get()
  async listar(@Query() queryParams: ListarReceitasQueryDto) {
    return await this.receitaService.listar(queryParams);
  }

  @Get(':id')
  async buscarPorId(@Param('id') id: number) {
    return await this.receitaService.buscarPorId(id);
  }

  @Put(':id')
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
  async excluir(@Param('id') id: number) {
    return await this.receitaService.excluir(id);
  }
}
