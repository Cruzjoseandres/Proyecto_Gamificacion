import { PartialType } from '@nestjs/mapped-types';
import { CrearRegistroActividadDto } from './crear-registro-actividad.dto';

export class ActualizarRegistroActividadDto extends PartialType(
  CrearRegistroActividadDto,
) {}
