import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceitaEntity } from './receita.entity';
import { ReceitaController } from './receita.controller';
import { ReceitaService } from './receita.service';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { CategoriaEntity } from '../categoria/categoria.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReceitaEntity, UsuarioEntity, CategoriaEntity]),
  ],
  controllers: [ReceitaController],
  providers: [ReceitaService],
})
export class ReceitaModule {}