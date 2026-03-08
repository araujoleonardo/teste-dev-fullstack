import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CriarCategoriaDto {
  @ApiProperty({ example: 'Doces', description: 'O nome da categoria' })
  @IsNotEmpty({ message: 'O nome da categoria é obrigatório' })
  @IsString({ message: 'O nome da categoria deve ser uma string' })
  @MaxLength(100, { message: 'O nome da categoria pode ter no máximo 100 caracteres' })
  nome: string;
}
