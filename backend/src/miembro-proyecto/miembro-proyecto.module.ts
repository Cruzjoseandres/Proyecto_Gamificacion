import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiembroProyectoService } from './miembro-proyecto.service';
import { MiembroProyectoController } from './miembro-proyecto.controller';
import { MiembroProyecto } from './entities/miembro-proyecto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MiembroProyecto])],
  controllers: [MiembroProyectoController],
  providers: [MiembroProyectoService],
  exports: [MiembroProyectoService, TypeOrmModule],
})
export class MiembroProyectoModule {}
