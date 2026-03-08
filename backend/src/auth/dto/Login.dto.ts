import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'O login do usuário' })
  @IsNotEmpty({ message: 'O login é obrigatório.' })
  login: string;

  @ApiProperty({ example: '123456', description: 'A senha do usuário (mínimo 6 caracteres)' })
  @MinLength(6, { message: 'A senha precisa ter pelo menos 6 caracteres' })
  senha: string;
}
