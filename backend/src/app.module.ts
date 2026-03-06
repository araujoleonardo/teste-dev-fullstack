import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './usuario/usuario.module';
import { ReceitaModule } from './receita/receita.module';
import { CategoriaModule } from './categoria/categoria.module';
import { AuthModule } from './auth/auth.module';
import { UsuarioEntity } from './usuario/usuario.entity';
import { CategoriaEntity } from './categoria/categoria.entity';
import { ReceitaEntity } from './receita/receita.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [UsuarioEntity, CategoriaEntity, ReceitaEntity],
        synchronize: false,
      }),
    }),
    AuthModule,
    UsuarioModule,
    ReceitaModule,
    CategoriaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
