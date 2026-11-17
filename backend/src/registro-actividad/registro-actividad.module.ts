import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistroActividadService } from './registro-actividad.service';
import { RegistroActividadController } from './registro-actividad.controller';
import { RegistroActividad } from './entities/registro-actividad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RegistroActividad])],
  controllers: [RegistroActividadController],
  providers: [RegistroActividadService],
  exports: [RegistroActividadService, TypeOrmModule],
})
export class RegistroActividadModule {}
