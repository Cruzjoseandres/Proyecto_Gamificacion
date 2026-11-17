import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MedallaService } from './medalla.service';
import { CrearMedallaDto } from './dto/crear-medalla.dto';
import { ActualizarMedallaDto } from './dto/actualizar-medalla.dto';

@Controller('medallas')
export class MedallaController {
  constructor(private readonly medallaService: MedallaService) {}

  @Post()
  async crear(@Body() crearMedallaDto: CrearMedallaDto) {
    return await this.medallaService.crear(crearMedallaDto);
  }

  @Get()
  async obtenerTodas() {
    return await this.medallaService.obtenerTodas();
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    return await this.medallaService.obtenerPorId(+id);
  }

  @Patch(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() actualizarMedallaDto: ActualizarMedallaDto,
  ) {
    return await this.medallaService.actualizar(+id, actualizarMedallaDto);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    return await this.medallaService.eliminar(+id);
  }
}
