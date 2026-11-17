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
import { ActividadService } from './actividad.service';
import { CrearActividadDto } from './dto/crear-actividad.dto';
import { ActualizarActividadDto } from './dto/actualizar-actividad.dto';
import { EstadoActividad, TipoActividad } from '../enums';

@Controller('actividades')
export class ActividadController {
  constructor(private readonly actividadService: ActividadService) {}

  @Post()
  async crear(@Body() crearActividadDto: CrearActividadDto) {
    return await this.actividadService.crear(crearActividadDto);
  }

  @Get()
  async obtenerTodas(
    @Query('proyectoId') proyectoId?: string,
    @Query('usuarioId') usuarioId?: string,
    @Query('tipo') tipo?: TipoActividad,
    @Query('estado') estado?: EstadoActividad,
  ) {
    return await this.actividadService.obtenerTodas({
      proyectoId: proyectoId ? Number(proyectoId) : undefined,
      usuarioId: usuarioId ? Number(usuarioId) : undefined,
      tipo,
      estado,
    });
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    return await this.actividadService.obtenerPorId(+id);
  }

  @Patch(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() actualizarActividadDto: ActualizarActividadDto,
  ) {
    return await this.actividadService.actualizar(+id, actualizarActividadDto);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    return await this.actividadService.eliminar(+id);
  }

  @Post(':id/completar')
  async completar(
    @Param('id') id: string,
    @Body() body: { usuarioId?: number; notas?: string },
  ) {
    return await this.actividadService.completarActividad(+id, body);
  }
}
