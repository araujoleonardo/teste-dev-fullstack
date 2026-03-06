import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AtualizarReceitaDto {
  @IsOptional()
  @IsString({ message: 'O nome da receita deve ser uma string' })
  @MaxLength(45, { message: 'O nome da receita pode ter no máximo 45 caracteres' })
  nome?: string;

  @IsOptional()
  @IsInt({ message: 'O tempo de preparo deve ser um número inteiro' })
  @Min(1, { message: 'O tempo de preparo deve ser de pelo menos 1 minuto' })
  @Type(() => Number)
  tempoPreparoMinutos?: number;

  @IsOptional()
  @IsInt({ message: 'As porções devem ser um número inteiro' })
  @Min(1, { message: 'A receita deve render pelo menos 1 porção' })
  @Type(() => Number)
  porcoes?: number;

  @IsOptional()
  @IsString({ message: 'O modo de preparo deve ser uma string' })
  modoPreparo?: string;

  @IsOptional()
  @IsString({ message: 'Os ingredientes devem ser uma string' })
  ingredientes?: string;

  @IsOptional()
  @IsInt({ message: 'O usuário é inválido' })
  @Type(() => Number)
  idUsuarios?: number;

  @IsOptional()
  @IsInt({ message: 'A categoria é inválida' })
  @Type(() => Number)
  idCategorias?: number;
}
