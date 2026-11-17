import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { LoginDto, RegistroDto } from './dto/crear-autenticacion.dto';
import { JwtAuthGuard, type RequestConUsuario } from './guards/jwt-auth.guard';

@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

  @Post('registro')
  async registrar(@Body() dto: RegistroDto) {
    return await this.autenticacionService.registrar(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.autenticacionService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  async obtenerPerfil(@Req() req: RequestConUsuario) {
    return await this.autenticacionService.obtenerPerfil(Number(req.usuario.id));
  }
}
