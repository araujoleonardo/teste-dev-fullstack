import { ApiProperty } from '@nestjs/swagger';

class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Leonardo Araujo' })
  nome: string;

  @ApiProperty({ example: 'leonardo' })
  login: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ example: 36000, description: 'Tempo de expiração do token em segundos' })
  expires_in: number;

  @ApiProperty()
  usuario: UserResponseDto;
}
