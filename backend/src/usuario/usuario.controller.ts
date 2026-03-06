import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CriarUsuarioDto } from './dto/CriarUsuario.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('usuarios')
export class UsuarioController {
  constructor(
    private usuarioService: UsuarioService
  ) {}

  @Post()
  async criar(@Body() usuario: CriarUsuarioDto) {
    const data = await this.usuarioService.criar(usuario);

    return {
      usuario: data,
      message: 'Usuário criado com sucesso',
    };
  }

  @UseGuards(JwtAuthGuard) //Rota protegida
  @Get()
  async listar() {
    return await this.usuarioService.listar();
  }
}

