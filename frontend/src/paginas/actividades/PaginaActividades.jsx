import {
  CheckCircle2,
  FolderKanban,
  Layers,
  Plus,
  Repeat,
  SlidersHorizontal,
  User,
  Zap,
} from 'lucide-react';
import { Boton } from '../../componentes/atomos/Boton';
import { CampoTexto } from '../../componentes/atomos/CampoTexto';
import { ControlSegmentado } from '../../componentes/atomos/ControlSegmentado';
import { ModalBase } from '../../componentes/atomos/ModalBase';
import { Selector } from '../../componentes/atomos/Selector';
import { SelectorFecha } from '../../componentes/atomos/SelectorFecha';
import { TarjetaActividad } from '../../componentes/moleculas/TarjetaActividad';
import {
  EstadoActividad,
  FrecuenciaActividad,
  TipoActividad,
} from '../../constantes/enums';
import { useActividades } from './useActividades';

export function PaginaActividades() {
  const {
    listaActividades,
    filtros,
    cargando,
    opcionesProyectos,
    opcionesUsuarios,
    modalCrearAbierto,
    setModalCrearAbierto,
    guardando,
    idCompletando,
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    tipo,
    setTipo,
    frecuencia,
    setFrecuencia,
    recompensaExp,
    setRecompensaExp,
    proyectoId,
    setProyectoId,
    asignadoId,
    setAsignadoId,
    fechaLimite,
    setFechaLimite,
    alCambiarFiltro,
    alCrearActividad,
    alCompletarActividad,
    alCambiarEstado,
    alEliminarActividad,
  } = useActividades();

  return (
    <div className="vista-animada space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="apple-heading text-2xl font-semibold text-[#1D1D1F] dark:text-white">
            Actividades Únicas y Recurrentes
          </h1>
          <p className="mt-1 text-xs text-[#6E6E73] dark:text-zinc-400">
            Registra tareas puntuales o hábitos continuos, complétalos y acumula
            experiencia.
          </p>
        </div>

        <Boton
          variante="primario"
          icono={<Plus className="h-4 w-4" strokeWidth={2} />}
          onClick={() => setModalCrearAbierto(true)}
        >
          Nueva actividad
        </Boton>
      </div>

      {/* Barra de filtros personalizados Apple */}
      <section className="apple-card rounded-2xl p-4">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase text-[#6E6E73] dark:text-zinc-400 apple-overline">
          <SlidersHorizontal
            className="h-3.5 w-3.5 text-[#0071E3] dark:text-[#409CFF]"
            strokeWidth={1.75}
          />
          Filtros rápidos
        </div>

        <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-3">
          <Selector
            id="filtro-proyecto"
            etiqueta="Proyecto"
            placeholder="Todos los proyectos"
            icono={<FolderKanban className="h-4 w-4" strokeWidth={1.75} />}
            opciones={opcionesProyectos}
            value={filtros.proyectoId}
            onChange={(e) => alCambiarFiltro('proyectoId', e.target.value)}
          />

          <ControlSegmentado
            etiqueta="Tipo de actividad"
            value={filtros.tipo}
            onChange={(nuevoTipo) => alCambiarFiltro('tipo', nuevoTipo)}
            opciones={[
              {
                valor: '',
                etiqueta: 'Todas',
                icono: <Layers className="h-3.5 w-3.5" strokeWidth={1.75} />,
              },
              {
                valor: TipoActividad.UNICA,
                etiqueta: 'Únicas',
                icono: (
                  <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                ),
              },
              {
                valor: TipoActividad.RECURRENTE,
                etiqueta: 'Recurrentes',
                icono: <Repeat className="h-3.5 w-3.5" strokeWidth={1.75} />,
              },
            ]}
          />

          <Selector
            id="filtro-estado"
            etiqueta="Estado"
            placeholder="Todos los estados"
            icono={<CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />}
            opciones={[
              { valor: EstadoActividad.PENDIENTE, etiqueta: 'Pendiente' },
              { valor: EstadoActividad.EN_PROGRESO, etiqueta: 'En Progreso' },
              { valor: EstadoActividad.COMPLETADA, etiqueta: 'Completada' },
              { valor: EstadoActividad.CANCELADA, etiqueta: 'Cancelada' },
            ]}
            value={filtros.estado}
            onChange={(e) => alCambiarFiltro('estado', e.target.value)}
          />
        </div>
      </section>

      {/* Lista de actividades */}
      {cargando && listaActividades.length === 0 ? (
        <div className="apple-card rounded-2xl p-10 text-center text-xs text-[#6E6E73] dark:text-zinc-400">
          Cargando actividades...
        </div>
      ) : listaActividades.length === 0 ? (
        <div className="apple-card rounded-2xl border-dashed p-10 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0071E3]/10 text-[#0071E3] dark:bg-[#0A84FF]/15 dark:text-[#409CFF]">
            <CheckCircle2 className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <p className="apple-heading text-base font-semibold text-[#1D1D1F] dark:text-white">
            No hay actividades para mostrar
          </p>
          <p className="mt-1 text-xs text-[#6E6E73] dark:text-zinc-400">
            Prueba limpiando los filtros o registra una nueva actividad única o
            recurrente.
          </p>
          <Boton
            variante="primario"
            className="mt-4"
            icono={<Plus className="h-4 w-4" strokeWidth={2} />}
            onClick={() => setModalCrearAbierto(true)}
          >
            Crear actividad
          </Boton>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {listaActividades.map((actividad) => (
            <TarjetaActividad
              key={actividad.id}
              actividad={actividad}
              completando={idCompletando === actividad.id}
              alCompletar={alCompletarActividad}
              alCambiarEstado={alCambiarEstado}
              alEliminar={alEliminarActividad}
            />
          ))}
        </div>
      )}

      {/* Modal: Nueva Actividad (100% controles a medida) */}
      <ModalBase
        abierto={modalCrearAbierto}
        alCerrar={() => setModalCrearAbierto(false)}
        titulo="Registrar nueva actividad"
        subtitulo="Define si es una actividad única o recurrente y asigna su recompensa XP."
      >
        <form onSubmit={alCrearActividad} className="space-y-4">
          <CampoTexto
            id="act-titulo"
            etiqueta="Título de la actividad"
            required
            placeholder="Ej. Estudiar algoritmos 30 minutos"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <CampoTexto
            id="act-descripcion"
            etiqueta="Descripción"
            multilinea
            filas={2}
            placeholder="Detalles o criterios para completarla..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ControlSegmentado
              etiqueta="Tipo"
              value={tipo}
              onChange={setTipo}
              opciones={[
                {
                  valor: TipoActividad.UNICA,
                  etiqueta: 'Única',
                  icono: (
                    <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                  ),
                },
                {
                  valor: TipoActividad.RECURRENTE,
                  etiqueta: 'Recurrente',
                  icono: <Repeat className="h-3.5 w-3.5" strokeWidth={1.75} />,
                },
              ]}
            />

            {tipo === TipoActividad.RECURRENTE ? (
              <ControlSegmentado
                etiqueta="Frecuencia"
                value={frecuencia}
                onChange={setFrecuencia}
                opciones={[
                  { valor: FrecuenciaActividad.DIARIA, etiqueta: 'Diaria' },
                  { valor: FrecuenciaActividad.SEMANAL, etiqueta: 'Semanal' },
                  { valor: FrecuenciaActividad.MENSUAL, etiqueta: 'Mensual' },
                ]}
              />
            ) : (
              <SelectorFecha
                id="act-fecha-limite"
                etiqueta="Fecha límite (opcional)"
                value={fechaLimite}
                onChange={(e) => setFechaLimite(e.target.value)}
              />
            )}
          </div>

          <ControlSegmentado
            etiqueta="Recompensa de experiencia"
            value={recompensaExp}
            onChange={setRecompensaExp}
            opciones={[
              {
                valor: '25',
                etiqueta: '+25 XP',
                icono: <Zap className="h-3 w-3 text-amber-500" strokeWidth={2} />,
              },
              {
                valor: '50',
                etiqueta: '+50 XP',
                icono: <Zap className="h-3 w-3 text-amber-500" strokeWidth={2} />,
              },
              {
                valor: '100',
                etiqueta: '+100 XP',
                icono: <Zap className="h-3 w-3 text-amber-500" strokeWidth={2} />,
              },
              {
                valor: '150',
                etiqueta: '+150 XP',
                icono: <Zap className="h-3 w-3 text-amber-500" strokeWidth={2} />,
              },
            ]}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Selector
              id="act-proyecto"
              etiqueta="Proyecto (opcional)"
              placeholder="Actividad Personal"
              icono={<FolderKanban className="h-4 w-4" strokeWidth={1.75} />}
              ubicacionMenu="arriba"
              opciones={opcionesProyectos}
              value={proyectoId}
              onChange={(e) => setProyectoId(e.target.value)}
            />

            <Selector
              id="act-asignado"
              etiqueta="Asignar a miembro (opcional)"
              placeholder="Por defecto: tú mismo"
              icono={<User className="h-4 w-4" strokeWidth={1.75} />}
              ubicacionMenu="arriba"
              opciones={opcionesUsuarios}
              value={asignadoId}
              onChange={(e) => setAsignadoId(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-black/[0.06] dark:border-white/[0.08] pt-4">
            <Boton
              variante="secundario"
              onClick={() => setModalCrearAbierto(false)}
            >
              Cancelar
            </Boton>
            <Boton type="submit" cargando={guardando}>
              Guardar actividad
            </Boton>
          </div>
        </form>
      </ModalBase>
    </div>
  );
}
