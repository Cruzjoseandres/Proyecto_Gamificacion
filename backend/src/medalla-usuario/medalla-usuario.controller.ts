import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MedallaUsuarioService } from './medalla-usuario.service';
import { CrearMedallaUsuarioDto } from './dto/crear-medalla-usuario.dto';
import { ActualizarMedallaUsuarioDto } from './dto/actualizar-medalla-usuario.dto';

@Controller('medallas-usuario')
export class MedallaUsuarioController {
  constructor(
    private readonly medallaUsuarioService: MedallaUsuarioService,
  ) {}

  @Post()
  async crear(@Body() crearMedallaUsuarioDto: CrearMedallaUsuarioDto) {
    return await this.medallaUsuarioService.crear(crearMedallaUsuarioDto);
  }

  @Get()
  async obtenerTodas() {
    return await this.medallaUsuarioService.obtenerTodas();
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    return await this.medallaUsuarioService.obtenerPorId(+id);
  }

  @Patch(':id')
  async actualizar(
    @Param('id') id: string,
    @Body() actualizarMedallaUsuarioDto: ActualizarMedallaUsuarioDto,
  ) {
    return await this.medallaUsuarioService.actualizar(
      +id,
      actualizarMedallaUsuarioDto,
    );
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    return await this.medallaUsuarioService.eliminar(+id);
  }
}
