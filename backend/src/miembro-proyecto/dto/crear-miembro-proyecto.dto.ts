import { RolProyecto } from '../../enums';

export class CrearMiembroProyectoDto {
  proyectoId: number;
  usuarioId: number;
  rol?: RolProyecto;
}
