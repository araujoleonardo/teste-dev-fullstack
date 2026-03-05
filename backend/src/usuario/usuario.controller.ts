import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CriarUsuarioDto } from './dto/CriarUsuario.dto';

@Controller('usuarios')
export class UsuarioController {
  constructor(
    private usuarioRepository: UsuarioService
  ) {}

  @Post()
  async criar(@Body() usuario: CriarUsuarioDto) {
    const data = await this.usuarioRepository.criar(usuario);

    return {
      usuario: data,
      message: 'Usuário criado com sucesso',
    };
  }

  @Get()
  async listar() {
    return await this.usuarioRepository.listar();
  }
}
