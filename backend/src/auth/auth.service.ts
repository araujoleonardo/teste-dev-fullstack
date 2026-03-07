import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { LoginDto } from './dto/Login.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async login(data: LoginDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { login: data.login },
      select: ['id', 'nome', 'login', 'senha'], // Precisamos do senha explicitamente
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(data.senha, usuario.senha);
    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: usuario.id, login: usuario.login, nome: usuario.nome };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        login: usuario.login,
      },
    };
  }

  async logout(token: string): Promise<void> {
    const decoded = this.jwtService.decode(token) as { exp: number };

    if (!decoded?.exp) return;

    const agora = Math.floor(Date.now() / 1000);
    const ttl = decoded.exp - agora;

    if (ttl > 0) {
      // Guarda o token via redis
      await this.redisService.set(`blacklist:${token}`, '1', ttl);
    }
  }

  async isTokenRevogado(token: string): Promise<boolean> {
    return this.redisService.exists(`blacklist:${token}`);
  }
}
