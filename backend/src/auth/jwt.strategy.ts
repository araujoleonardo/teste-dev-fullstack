import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { RedisService } from '../redis/redis.service';

export interface JwtPayload {
  sub: number;
  login: string;
  nome: string;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
      passReqToCallback: true, // necessário para acessar o token
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    // Extrai o token do header para verificar na blacklist
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    if (token && (await this.redisService.exists(`blacklist:${token}`))) {
      throw new UnauthorizedException('Token revogado. Faça login novamente.');
    }

    return { id: payload.sub, login: payload.login, nome: payload.nome };
  }
}
