import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class AtualizarCategoriaDto {
  @ApiPropertyOptional({ example: 'Bolos', description: 'O novo nome da categoria' })
  @IsOptional()
  @IsNotEmpty({ message: 'O nome da categoria não pode estar vazio' })
  @IsString({ message: 'O nome da categoria deve ser uma string' })
  @MaxLength(100, { message: 'O nome da categoria pode ter no máximo 100 caracteres' })
  nome?: string;
}
