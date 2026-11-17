import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { CrearProyectoDto } from './dto/crear-proyecto.dto';
import { ActualizarProyectoDto } from './dto/actualizar-proyecto.dto';
import { RolProyecto } from '../enums';

@Controller('proyectos')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}

  @Post()
  async crear(@Body() crearProyectoDto: CrearProyectoDto) {
    return await this.proyectoService.crear(crearProyectoDto);
  }

  @Get()
  async obtenerTodos(@Query('usuarioId') usuarioId?: string) {
    return await this.proyectoService.obtenerTodos(
      usuarioId ? Number(usuarioId) : undefined,
    );
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    return await this.proyectoService.obtenerPorId(+id);
  }

  @Patch(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() actualizarProyectoDto: ActualizarProyectoDto,
  ) {
    return await this.proyectoService.actualizar(+id, actualizarProyectoDto);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    return await this.proyectoService.eliminar(+id);
  }

  @Post(':id/vincular')
  async vincularUsuario(
    @Param('id') id: string,
    @Body() body: { usuarioId?: number; correo?: string; rol?: RolProyecto },
  ) {
    return await this.proyectoService.vincularUsuario(+id, body);
  }

  @Delete(':id/miembros/:usuarioId')
  async desvincularUsuario(
    @Param('id') id: string,
    @Param('usuarioId') usuarioId: string,
  ) {
    return await this.proyectoService.desvincularUsuario(+id, +usuarioId);
  }
}
