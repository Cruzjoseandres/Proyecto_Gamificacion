import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MiembroProyectoService } from './miembro-proyecto.service';
import { CrearMiembroProyectoDto } from './dto/crear-miembro-proyecto.dto';
import { ActualizarMiembroProyectoDto } from './dto/actualizar-miembro-proyecto.dto';

@Controller('miembros-proyecto')
export class MiembroProyectoController {
  constructor(
    private readonly miembroProyectoService: MiembroProyectoService,
  ) {}

  @Post()
  async crear(@Body() crearMiembroProyectoDto: CrearMiembroProyectoDto) {
    return await this.miembroProyectoService.crear(crearMiembroProyectoDto);
  }

  @Get()
  async obtenerTodos() {
    return await this.miembroProyectoService.obtenerTodos();
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    return await this.miembroProyectoService.obtenerPorId(+id);
  }

  @Patch(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() actualizarMiembroProyectoDto: ActualizarMiembroProyectoDto,
  ) {
    return await this.miembroProyectoService.actualizar(
      +id,
      actualizarMiembroProyectoDto,
    );
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    return await this.miembroProyectoService.eliminar(+id);
  }
}
