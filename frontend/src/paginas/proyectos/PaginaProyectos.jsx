import { FolderKanban, Plus, UserMinus, UserPlus, Users, X } from 'lucide-react';
import { Boton } from '../../componentes/atomos/Boton';
import { CampoTexto } from '../../componentes/atomos/CampoTexto';
import { ControlSegmentado } from '../../componentes/atomos/ControlSegmentado';
import { Insignia } from '../../componentes/atomos/Insignia';
import { ModalBase } from '../../componentes/atomos/ModalBase';
import { Selector } from '../../componentes/atomos/Selector';
import { TarjetaProyecto } from '../../componentes/moleculas/TarjetaProyecto';
import { GraficoEstadoActividades } from '../../componentes/organismos/GraficoEstadoActividades';
import { GraficoProgresoAcciones } from '../../componentes/organismos/GraficoProgresoAcciones';
import {
  COLORES_PROYECTO,
  ETIQUETAS_ROL_PROYECTO,
  RolProyecto,
} from '../../constantes/enums';
import { useProyectos } from './useProyectos';

export function PaginaProyectos() {
  const {
    listaProyectos,
    proyectoSeleccionado,
    reporteProyectoActual,
    cargando,
    opcionesUsuarios,
    modalCrearAbierto,
    setModalCrearAbierto,
    nombreProyecto,
    setNombreProyecto,
    descripcionProyecto,
    setDescripcionProyecto,
    colorProyecto,
    setColorProyecto,
    guardandoProyecto,
    proyectoParaVincular,
    usuarioIdVincular,
    setUsuarioIdVincular,
    correoVincular,
    setCorreoVincular,
    rolVincular,
    setRolVincular,
    vinculando,
    alSeleccionarProyecto,
    alCrearProyecto,
    alAbrirModalVincular,
    alCerrarModalVincular,
    alVincularMiembro,
    alDesvincularMiembro,
    alEliminarProyecto,
  } = useProyectos();

  return (
    <div className="vista-animada space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="apple-heading text-2xl font-semibold text-[#1D1D1F] dark:text-white">
            Proyectos y Equipos
          </h1>
          <p className="mt-1 text-xs text-[#6E6E73] dark:text-zinc-400">
            Organiza tus metas colaborativas, vincula miembros y revisa el
            avance gráfico de cada proyecto.
          </p>
        </div>

        <Boton
          variante="primario"
          icono={<Plus className="h-4 w-4" strokeWidth={2} />}
          onClick={() => setModalCrearAbierto(true)}
        >
          Nuevo proyecto
        </Boton>
      </div>

      {/* Lista de proyectos */}
      {cargando && listaProyectos.length === 0 ? (
        <div className="apple-card rounded-2xl p-10 text-center text-xs text-[#6E6E73] dark:text-zinc-400">
          Cargando proyectos...
        </div>
      ) : listaProyectos.length === 0 ? (
        <div className="apple-card rounded-2xl border-dashed p-10 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0071E3]/10 text-[#0071E3] dark:bg-[#0A84FF]/15 dark:text-[#409CFF]">
            <FolderKanban className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <p className="apple-heading text-base font-semibold text-[#1D1D1F] dark:text-white">
            Todavía no tienes proyectos
          </p>
          <p className="mt-1 text-xs text-[#6E6E73] dark:text-zinc-400">
            Crea tu primer proyecto para agrupar actividades y colaborar con
            otros usuarios.
          </p>
          <Boton
            variante="primario"
            className="mt-4"
            icono={<Plus className="h-4 w-4" strokeWidth={2} />}
            onClick={() => setModalCrearAbierto(true)}
          >
            Crear primer proyecto
          </Boton>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {listaProyectos.map((proyecto) => (
            <TarjetaProyecto
              key={proyecto.id}
              proyecto={proyecto}
              seleccionado={proyectoSeleccionado?.id === proyecto.id}
              alSeleccionar={alSeleccionarProyecto}
              alAbrirVincular={alAbrirModalVincular}
              alEliminar={alEliminarProyecto}
            />
          ))}
        </div>
      )}

      {/* Detalle y reporte del proyecto seleccionado */}
      {proyectoSeleccionado && (
        <section className="apple-card space-y-6 rounded-3xl p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/[0.06] dark:border-white/[0.08] pb-4">
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full shrink-0"
                style={{
                  backgroundColor: proyectoSeleccionado.color || '#0071E3',
                }}
              />
              <div>
                <h2 className="apple-heading text-xl font-semibold text-[#1D1D1F] dark:text-white">
                  {proyectoSeleccionado.nombre}
                </h2>
                <p className="mt-0.5 text-xs text-[#6E6E73] dark:text-zinc-400">
                  {proyectoSeleccionado.descripcion ||
                    'Panel detallado del proyecto'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Boton
                variante="secundario"
                tamano="sm"
                icono={<UserPlus className="h-3.5 w-3.5" strokeWidth={1.75} />}
                onClick={() => alAbrirModalVincular(proyectoSeleccionado)}
              >
                Vincular usuario
              </Boton>
              <Boton
                variante="fantasma"
                tamano="sm"
                className="px-2"
                onClick={() => alSeleccionarProyecto(proyectoSeleccionado)}
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </Boton>
            </div>
          </div>

          {/* Miembros vinculados y rendimiento */}
          <div>
            <h3 className="apple-overline mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase text-[#6E6E73] dark:text-zinc-400">
              <Users className="h-3.5 w-3.5 text-[#0071E3]" strokeWidth={1.75} />
              Miembros del equipo y aporte
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(
                reporteProyectoActual?.rendimientoMiembros ||
                (proyectoSeleccionado.miembros || []).map((m) => ({
                  usuarioId: m.usuarioId,
                  nombre: m.usuario?.nombre,
                  correo: m.usuario?.correo,
                  rol: m.rol,
                  actividadesCompletadas: 0,
                  experienciaAportada: 0,
                }))
              ).map((miembro) => (
                <div
                  key={miembro.usuarioId}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.025] dark:bg-white/[0.04] p-3.5"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-[#1D1D1F] dark:text-white">
                        {miembro.nombre || miembro.correo}
                      </p>
                      <Insignia
                        variante={
                          miembro.rol === RolProyecto.PROPIETARIO
                            ? 'indigo'
                            : 'gris'
                        }
                      >
                        {ETIQUETAS_ROL_PROYECTO[miembro.rol] || miembro.rol}
                      </Insignia>
                    </div>
                    <p className="truncate text-xs text-[#6E6E73] dark:text-zinc-400">
                      {miembro.correo}
                    </p>
                    <p className="tabular-nums mt-1 text-xs font-semibold text-[#0071E3] dark:text-[#409CFF]">
                      {miembro.actividadesCompletadas} entregas · +
                      {miembro.experienciaAportada} XP
                    </p>
                  </div>

                  {miembro.rol !== RolProyecto.PROPIETARIO && (
                    <button
                      type="button"
                      title="Desvincular miembro"
                      onClick={() =>
                        alDesvincularMiembro(
                          proyectoSeleccionado.id,
                          miembro.usuarioId,
                        )
                      }
                      className="btn-interactivo rounded-lg p-1.5 text-zinc-400 hover:bg-rose-500/10 hover:text-rose-500 cursor-pointer"
                    >
                      <UserMinus className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Gráficos del proyecto */}
          {reporteProyectoActual && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <GraficoEstadoActividades
                actividadesPorEstado={
                  reporteProyectoActual.actividadesPorEstado
                }
              />
              <GraficoProgresoAcciones
                datos={reporteProyectoActual.progresoPorAccion || []}
                titulo="Avance por Acción del Proyecto"
                subtitulo="Cumplimiento de cada actividad dentro de este proyecto"
              />
            </div>
          )}
        </section>
      )}

      {/* Modal: Nuevo Proyecto */}
      <ModalBase
        abierto={modalCrearAbierto}
        alCerrar={() => setModalCrearAbierto(false)}
        titulo="Crear nuevo proyecto"
        subtitulo="Agrupa actividades individuales o colaborativas bajo un color distintivo."
      >
        <form onSubmit={alCrearProyecto} className="space-y-4">
          <CampoTexto
            id="proyecto-nombre"
            etiqueta="Nombre del proyecto"
            required
            placeholder="Ej. Sistema Web Universitario"
            value={nombreProyecto}
            onChange={(e) => setNombreProyecto(e.target.value)}
          />

          <CampoTexto
            id="proyecto-descripcion"
            etiqueta="Descripción"
            multilinea
            placeholder="Objetivo principal del proyecto..."
            value={descripcionProyecto}
            onChange={(e) => setDescripcionProyecto(e.target.value)}
          />

          <div>
            <span className="apple-overline block text-[11px] font-semibold uppercase text-[#6E6E73] dark:text-zinc-400 mb-2">
              Color para gráficos
            </span>
            <div className="flex flex-wrap gap-2.5">
              {COLORES_PROYECTO.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setColorProyecto(color)}
                  aria-label={`Seleccionar color ${color}`}
                  className={`btn-interactivo h-7 w-7 rounded-full cursor-pointer transition-transform ${
                    colorProyecto === color
                      ? 'ring-2 ring-offset-2 ring-[#1D1D1F] dark:ring-white dark:ring-offset-[#16161A] scale-110'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Boton
              variante="secundario"
              onClick={() => setModalCrearAbierto(false)}
            >
              Cancelar
            </Boton>
            <Boton type="submit" cargando={guardandoProyecto}>
              Guardar proyecto
            </Boton>
          </div>
        </form>
      </ModalBase>

      {/* Modal: Vincular Usuario al Proyecto */}
      <ModalBase
        abierto={Boolean(proyectoParaVincular)}
        alCerrar={alCerrarModalVincular}
        titulo="Vincular usuario al proyecto"
        subtitulo={
          proyectoParaVincular
            ? `Proyecto: ${proyectoParaVincular.nombre}`
            : ''
        }
      >
        <form onSubmit={alVincularMiembro} className="space-y-4">
          <Selector
            id="vincular-usuario-lista"
            etiqueta="Seleccionar usuario registrado"
            placeholder="Elegir usuario de la lista"
            opciones={opcionesUsuarios}
            value={usuarioIdVincular}
            onChange={(e) => {
              setUsuarioIdVincular(e.target.value);
              if (e.target.value) setCorreoVincular('');
            }}
          />

          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-black/[0.08] dark:border-white/[0.1]" />
            <span className="mx-3 text-[11px] font-medium text-[#6E6E73] dark:text-zinc-400">
              o ingresa su correo
            </span>
            <div className="flex-grow border-t border-black/[0.08] dark:border-white/[0.1]" />
          </div>

          <CampoTexto
            id="vincular-correo"
            etiqueta="Correo del miembro"
            type="email"
            placeholder="companero@universidad.edu"
            value={correoVincular}
            onChange={(e) => {
              setCorreoVincular(e.target.value);
              if (e.target.value) setUsuarioIdVincular('');
            }}
          />

          <ControlSegmentado
            etiqueta="Rol dentro del proyecto"
            value={rolVincular}
            onChange={setRolVincular}
            opciones={[
              { valor: RolProyecto.MIEMBRO, etiqueta: 'Miembro' },
              { valor: RolProyecto.ADMINISTRADOR, etiqueta: 'Administrador' },
            ]}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Boton variante="secundario" onClick={alCerrarModalVincular}>
              Cancelar
            </Boton>
            <Boton type="submit" cargando={vinculando}>
              Vincular al equipo
            </Boton>
          </div>
        </form>
      </ModalBase>
    </div>
  );
}
