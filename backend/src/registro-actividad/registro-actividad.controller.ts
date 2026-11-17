import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RegistroActividadService } from './registro-actividad.service';
import { CrearRegistroActividadDto } from './dto/crear-registro-actividad.dto';
import { ActualizarRegistroActividadDto } from './dto/actualizar-registro-actividad.dto';

@Controller('registros-actividad')
export class RegistroActividadController {
  constructor(
    private readonly registroActividadService: RegistroActividadService,
  ) {}

  @Post()
  async crear(@Body() crearRegistroActividadDto: CrearRegistroActividadDto) {
    return await this.registroActividadService.crear(crearRegistroActividadDto);
  }

  @Get()
  async obtenerTodos() {
    return await this.registroActividadService.obtenerTodos();
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    return await this.registroActividadService.obtenerPorId(+id);
  }

  @Patch(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() actualizarRegistroActividadDto: ActualizarRegistroActividadDto,
  ) {
    return await this.registroActividadService.actualizar(
      +id,
      actualizarRegistroActividadDto,
    );
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    return await this.registroActividadService.eliminar(+id);
  }
}
