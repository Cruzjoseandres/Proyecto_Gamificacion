import {
  EstadoActividad,
  FrecuenciaActividad,
  TipoActividad,
} from '../../enums';

export class CrearActividadDto {
  titulo: string;
  descripcion?: string;
  tipo?: TipoActividad;
  frecuencia?: FrecuenciaActividad;
  recompensaExp?: number;
  estado?: EstadoActividad;
  fechaLimite?: Date;
  proyectoId?: number;
  creadorId: number;
  asignadoId?: number;
}
