import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async crear(@Body() crearUsuarioDto: CrearUsuarioDto) {
    return await this.usuarioService.crear(crearUsuarioDto);
  }

  @Get()
  async obtenerTodos() {
    return await this.usuarioService.obtenerTodos();
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    return await this.usuarioService.obtenerPorId(+id);
  }

  @Patch(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() actualizarUsuarioDto: ActualizarUsuarioDto,
  ) {
    return await this.usuarioService.actualizar(+id, actualizarUsuarioDto);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    return await this.usuarioService.eliminar(+id);
  }
}
