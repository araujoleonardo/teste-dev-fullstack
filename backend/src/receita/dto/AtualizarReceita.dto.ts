import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AtualizarReceitaDto {
  @ApiPropertyOptional({ example: 'Bolo de Cenoura Premium', description: 'Nome da receita' })
  @IsOptional()
  @IsString({ message: 'O nome da receita deve ser uma string' })
  @MaxLength(45, { message: 'O nome da receita pode ter no máximo 45 caracteres' })
  nome?: string;

  @ApiPropertyOptional({ example: 45, description: 'Tempo de preparo em minutos' })
  @IsOptional()
  @IsInt({ message: 'O tempo de preparo deve ser un número inteiro' })
  @Min(1, { message: 'O tempo de preparo deve ser de pelo menos 1 minuto' })
  @Type(() => Number)
  tempoPreparoMinutos?: number;

  @ApiPropertyOptional({ example: 10, description: 'Quantidade de porções' })
  @IsOptional()
  @IsInt({ message: 'As porções devem ser um número inteiro' })
  @Min(1, { message: 'A receita deve render pelo menos 1 porção' })
  @Type(() => Number)
  porcoes?: number;

  @ApiPropertyOptional({ example: 'Bata tudo e asse por 40min...', description: 'Modo de preparo' })
  @IsOptional()
  @IsString({ message: 'O modo de preparo deve ser uma string' })
  modoPreparo?: string;

  @ApiPropertyOptional({ example: 'Cenouras, Ovos, Farinha, Açúcar...', description: 'Ingredientes' })
  @IsOptional()
  @IsString({ message: 'Os ingredientes devem ser uma string' })
  ingredientes?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID do usuário' })
  @IsOptional()
  @IsInt({ message: 'O usuário é inválido' })
  @Type(() => Number)
  idUsuarios?: number;

  @ApiPropertyOptional({ example: 2, description: 'ID da categoria' })
  @IsOptional()
  @IsInt({ message: 'A categoria é inválida' })
  @Type(() => Number)
  idCategorias?: number;
}
