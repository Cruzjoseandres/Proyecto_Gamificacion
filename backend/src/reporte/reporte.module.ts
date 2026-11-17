import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReporteService } from './reporte.service';
import { ReporteController } from './reporte.controller';
import { Proyecto } from '../proyecto/entities/proyecto.entity';
import { Actividad } from '../actividad/entities/actividad.entity';
import { RegistroActividad } from '../registro-actividad/entities/registro-actividad.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { MiembroProyecto } from '../miembro-proyecto/entities/miembro-proyecto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Proyecto,
      Actividad,
      RegistroActividad,
      Usuario,
      MiembroProyecto,
    ]),
  ],
  controllers: [ReporteController],
  providers: [ReporteService],
  exports: [ReporteService],
})
export class ReporteModule {}

