import {
  Calendar,
  Check,
  CheckCircle2,
  FolderKanban,
  Repeat,
  Trash2,
  User,
  Zap,
} from 'lucide-react';
import {
  ETIQUETAS_ESTADO_ACTIVIDAD,
  ETIQUETAS_FRECUENCIA,
  ETIQUETAS_TIPO,
  EstadoActividad,
  TipoActividad,
} from '../../constantes/enums';
import { Boton } from '../atomos/Boton';
import { Insignia } from '../atomos/Insignia';
import { Selector } from '../atomos/Selector';

const VARIANTE_ESTADO = {
  PENDIENTE: 'ambar',
  EN_PROGRESO: 'azul',
  COMPLETADA: 'esmeralda',
  CANCELADA: 'gris',
};

const OPCIONES_ESTADO = [
  { valor: EstadoActividad.PENDIENTE, etiqueta: 'Pendiente' },
  { valor: EstadoActividad.EN_PROGRESO, etiqueta: 'En Progreso' },
  { valor: EstadoActividad.COMPLETADA, etiqueta: 'Completada' },
  { valor: EstadoActividad.CANCELADA, etiqueta: 'Cancelada' },
];

export function TarjetaActividad({
  actividad,
  alCompletar,
  alCambiarEstado,
  alEliminar,
  completando = false,
}) {
  const esRecurrente = actividad.tipo === TipoActividad.RECURRENTE;
  const estaCompletada = actividad.estado === EstadoActividad.COMPLETADA;
  const vecesCompletada = (actividad.registros || []).length;
  const puedeCompletar = esRecurrente || !estaCompletada;

  return (
    <div className="apple-card apple-card-interactiva flex flex-col justify-between gap-4 rounded-2xl p-5">
      <div className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Insignia variante={esRecurrente ? 'violeta' : 'indigo'}>
              {esRecurrente ? (
                <Repeat className="h-3 w-3" strokeWidth={1.75} />
              ) : (
                <CheckCircle2 className="h-3 w-3" strokeWidth={1.75} />
              )}
              {ETIQUETAS_TIPO[actividad.tipo] || actividad.tipo}
            </Insignia>

            {esRecurrente && (
              <Insignia variante="gris">
                {ETIQUETAS_FRECUENCIA[actividad.frecuencia] ||
                  actividad.frecuencia}
              </Insignia>
            )}

            <Insignia variante={VARIANTE_ESTADO[actividad.estado] || 'gris'}>
              {ETIQUETAS_ESTADO_ACTIVIDAD[actividad.estado] ||
                actividad.estado}
            </Insignia>
          </div>

          <span className="tabular-nums inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300 border border-amber-500/20">
            <Zap className="h-3 w-3" strokeWidth={2} />+
            {actividad.recompensaExp} XP
          </span>
        </div>

        <div>
          <h3 className="apple-heading text-base font-semibold text-[#1D1D1F] dark:text-white break-words">
            {actividad.titulo}
          </h3>
          {actividad.descripcion && (
            <p className="mt-1 text-xs leading-relaxed text-[#6E6E73] dark:text-zinc-400 break-words line-clamp-2">
              {actividad.descripcion}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-xs text-[#6E6E73] dark:text-zinc-400">
          <span className="inline-flex items-center gap-1.5 min-w-0 font-medium text-[#1D1D1F] dark:text-zinc-300">
            <FolderKanban
              className="h-3.5 w-3.5 shrink-0 text-[#6E6E73] dark:text-zinc-400"
              strokeWidth={1.75}
            />
            <span className="truncate max-w-[150px]">
              {actividad.proyecto?.nombre || 'Personal'}
            </span>
          </span>

          {actividad.asignado && (
            <span className="inline-flex items-center gap-1 min-w-0">
              <User className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
              <span className="truncate max-w-[130px]">
                {actividad.asignado.nombre || actividad.asignado.correo}
              </span>
            </span>
          )}

          {actividad.fechaLimite && (
            <span className="tabular-nums inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
              {new Date(actividad.fechaLimite).toLocaleDateString('es-ES')}
            </span>
          )}

          {esRecurrente && (
            <span className="tabular-nums font-medium text-violet-600 dark:text-violet-400">
              {vecesCompletada} {vecesCompletada === 1 ? 'ciclo' : 'ciclos'}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-black/[0.06] dark:border-white/[0.08] pt-3">
        <div className="w-36">
          {alCambiarEstado && (!estaCompletada || esRecurrente) && (
            <Selector
              tamano="sm"
              ubicacionMenu="arriba"
              placeholder=""
              opciones={OPCIONES_ESTADO}
              value={actividad.estado}
              onChange={(e) => alCambiarEstado(actividad.id, e.target.value)}
            />
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {alEliminar && (
            <Boton
              variante="fantasma"
              tamano="sm"
              onClick={() => alEliminar(actividad.id)}
              title="Eliminar actividad"
              className="px-2 text-zinc-400 hover:text-rose-500"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            </Boton>
          )}

          {puedeCompletar ? (
            <Boton
              variante="exito"
              tamano="sm"
              cargando={completando}
              icono={<Check className="h-3.5 w-3.5" strokeWidth={2} />}
              onClick={() => alCompletar(actividad)}
            >
              {esRecurrente ? 'Registrar ciclo' : 'Completar'}
            </Boton>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              Cumplida
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
