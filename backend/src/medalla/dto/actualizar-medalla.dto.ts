import { PartialType } from '@nestjs/mapped-types';
import { CrearMedallaDto } from './crear-medalla.dto';

export class ActualizarMedallaDto extends PartialType(CrearMedallaDto) {}
