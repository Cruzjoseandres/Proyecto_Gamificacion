import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReporteService } from './reporte.service';

@Controller('reportes')
export class ReporteController {
  constructor(private readonly reporteService: ReporteService) {}

  @Get('general')
  async obtenerReporteGeneral(@Query('usuarioId') usuarioId?: string) {
    return await this.reporteService.obtenerReporteGeneral(
      usuarioId ? Number(usuarioId) : undefined,
    );
  }

  @Get('proyecto/:id')
  async obtenerReporteProyecto(@Param('id') id: string) {
    return await this.reporteService.obtenerReporteProyecto(+id);
  }
}

