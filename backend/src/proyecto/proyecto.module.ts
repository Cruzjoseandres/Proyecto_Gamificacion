import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectoService } from './proyecto.service';
import { ProyectoController } from './proyecto.controller';
import { Proyecto } from './entities/proyecto.entity';
import { MiembroProyecto } from '../miembro-proyecto/entities/miembro-proyecto.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto, MiembroProyecto, Usuario])],
  controllers: [ProyectoController],
  providers: [ProyectoService],
  exports: [ProyectoService, TypeOrmModule],
})
export class ProyectoModule {}
