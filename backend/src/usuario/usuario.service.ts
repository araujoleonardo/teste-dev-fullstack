import { Repository } from 'typeorm';
import { UsuarioEntity } from './usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CriarUsuarioDto } from './dto/CriarUsuario.dto';
import { ListarUsuarioDTO } from './dto/ListarUsuario.dto';

export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  async criar(usuario: CriarUsuarioDto) {
    const usuarioEntity = new UsuarioEntity();

    usuarioEntity.nome = usuario.nome;
    usuarioEntity.login = usuario.login;
    usuarioEntity.senha = usuario.senha;

    return this.usuarioRepository.save(usuarioEntity);
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
