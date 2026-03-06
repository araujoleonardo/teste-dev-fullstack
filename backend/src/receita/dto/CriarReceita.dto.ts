import {
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CriarReceitaDto {
  @IsNotEmpty({ message: 'O nome da receita é obrigatório' })
  @IsString({ message: 'O nome da receita deve ser uma string' })
  @MaxLength(45, { message: 'O nome da receita pode ter no máximo 45 caracteres' })
  nome: string;

  @IsNotEmpty({ message: 'O tempo de preparo é obrigatório' })
  @IsInt({ message: 'O tempo de preparo deve ser um número inteiro' })
  @Min(1, { message: 'O tempo de preparo deve ser de pelo menos 1 minuto' })
  @Type(() => Number)
  tempoPreparoMinutos: number;

  @IsNotEmpty({ message: 'A quantidade de porções é obrigatória' })
  @IsInt({ message: 'As porções devem ser um número inteiro' })
  @Min(1, { message: 'A receita deve render pelo menos 1 porção' })
  @Type(() => Number)
  porcoes: number;

  @IsNotEmpty({ message: 'O modo de preparo é obrigatório' })
  @IsString({ message: 'O modo de preparo deve ser uma string' })
  modoPreparo: string;

  @IsNotEmpty({ message: 'Os ingredientes são obrigatórios' })
  @IsString({ message: 'Os ingredientes devem ser uma string' })
  ingredientes: string;

  @IsNotEmpty({ message: 'O usuário deve ser informado' })
  @IsInt({ message: 'O usuário informado é inválido' })
  @Type(() => Number)
  idUsuarios: number;

  @IsNotEmpty({ message: 'A categoria é obrigatória'})
  @IsInt({ message: 'A categoria informada é inválida' })
  @Type(() => Number)
  idCategorias: number;
}
