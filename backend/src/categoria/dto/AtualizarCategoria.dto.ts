import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class AtualizarCategoriaDto {
  @IsOptional()
  @IsNotEmpty({ message: 'O nome da categoria não pode estar vazio' })
  @IsString({ message: 'O nome da categoria deve ser uma string' })
  @MaxLength(100, { message: 'O nome da categoria pode ter no máximo 100 caracteres' })
  nome?: string;
}
