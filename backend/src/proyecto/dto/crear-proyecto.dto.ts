import { EstadoProyecto } from '../../enums';

export class CrearProyectoDto {
  nombre: string;
  descripcion?: string;
  color?: string;
  estado?: EstadoProyecto;
  propietarioId: number;
}
