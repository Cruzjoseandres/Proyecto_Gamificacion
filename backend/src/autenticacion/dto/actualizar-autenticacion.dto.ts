import { PartialType } from '@nestjs/mapped-types';
import { CrearAutenticacionDto } from './crear-autenticacion.dto';

export class ActualizarAutenticacionDto extends PartialType(
  CrearAutenticacionDto,
) {}
