import { Body, Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/Login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @UseGuards(JwtAuthGuard) //Rota protegida
  @Post('logout')
  async logout(@Request() req: { headers: { authorization?: string } }) {
    const token = req.headers.authorization?.replace('Bearer ', '') ?? '';
    await this.authService.logout(token);
    return { message: 'Logout realizado com sucesso' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(
    @Request()
    req: {
      user: {
        id: number;
        login: string;
        nome: string;
      };
    },
  ) {
    return req.user;
  }
}
