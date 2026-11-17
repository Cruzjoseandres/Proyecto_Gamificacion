import { PartialType } from '@nestjs/mapped-types';
import { CrearMiembroProyectoDto } from './crear-miembro-proyecto.dto';

export class ActualizarMiembroProyectoDto extends PartialType(
  CrearMiembroProyectoDto,
) {}
