import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadService } from './actividad.service';
import { ActividadController } from './actividad.controller';
import { Actividad } from './entities/actividad.entity';
import { RegistroActividad } from '../registro-actividad/entities/registro-actividad.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Medalla } from '../medalla/entities/medalla.entity';
import { MedallaUsuario } from '../medalla-usuario/entities/medalla-usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Actividad,
      RegistroActividad,
      Usuario,
      Medalla,
      MedallaUsuario,
    ]),
  ],
  controllers: [ActividadController],
  providers: [ActividadService],
  exports: [ActividadService, TypeOrmModule],
})
export class ActividadModule {}
