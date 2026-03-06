import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsuarioEntity } from './usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CriarUsuarioDto } from './dto/CriarUsuario.dto';
import { ListarUsuarioDTO } from './dto/ListarUsuario.dto';
import * as bcrypt from 'bcrypt';

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

  async listar(): Promise<ListarUsuarioDTO[]> {
    const usuarios = await this.usuarioRepository.find({
      select: {
        id: true,
        nome: true,
        login: true,
        criadoEm: true,
        alteradoEm: true,
      },
    });

    return usuarios.map((usuario) => ({
      id: usuario.id,
      nome: usuario.nome,
      login: usuario.login,
      criadoEm: usuario.criadoEm,
      alteradoEm: usuario.alteradoEm,
    }));
  }
}

