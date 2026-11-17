import { PartialType } from '@nestjs/mapped-types';
import { CrearMedallaUsuarioDto } from './crear-medalla-usuario.dto';

export class ActualizarMedallaUsuarioDto extends PartialType(
  CrearMedallaUsuarioDto,
) {}
