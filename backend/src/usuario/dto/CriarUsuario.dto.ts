import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CriarUsuarioDto {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString({ message: 'O nome deve ser uma string' })
  @MaxLength(100, { message: 'O nome pode ter no máximo 100 caracteres' })
  nome: string;

  @IsNotEmpty({ message: 'O login é obrigatório' })
  @IsString({ message: 'O login deve ser uma string' })
  @MaxLength(100, { message: 'O login pode ter no máximo 100 caracteres' })
  login: string;

  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha precisa ter pelo menos 6 caracteres' })
  senha: string;
}
