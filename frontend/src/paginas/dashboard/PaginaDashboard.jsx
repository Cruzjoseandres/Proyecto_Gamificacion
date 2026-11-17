import {
  ArrowRight,
  CheckCircle2,
  FolderKanban,
  RefreshCw,
  Target,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Boton } from '../../componentes/atomos/Boton';
import { TarjetaActividad } from '../../componentes/moleculas/TarjetaActividad';
import { TarjetaMetrica } from '../../componentes/moleculas/TarjetaMetrica';
import { GraficoAvanceProyectos } from '../../componentes/organismos/GraficoAvanceProyectos';
import { GraficoEstadoActividades } from '../../componentes/organismos/GraficoEstadoActividades';
import { GraficoHistorialCumplimiento } from '../../componentes/organismos/GraficoHistorialCumplimiento';
import { GraficoProgresoAcciones } from '../../componentes/organismos/GraficoProgresoAcciones';
import { useDashboard } from './useDashboard';

export function PaginaDashboard() {
  const {
    usuario,
    reporteGeneral,
    cargandoReporte,
    actividadesRapidas,
    idCompletando,
    alCompletarRapido,
    alRecargarDashboard,
  } = useDashboard();

  const resumen = reporteGeneral?.resumen || {
    totalProyectos: 0,
    totalActividades: 0,
    actividadesCompletadas: 0,
    actividadesEnProgreso: 0,
    actividadesPendientes: 0,
    porcentajeCumplimientoGlobal: 0,
    experienciaTotal: usuario?.experiencia || 0,
  };

  return (
    <div className="vista-animada space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="apple-heading text-2xl font-semibold text-[#1D1D1F] dark:text-white">
            Resumen de Progreso
          </h1>
          <p className="mt-1 text-xs text-[#6E6E73] dark:text-zinc-400">
            Métricas en tiempo real por proyecto, estado y acción individual.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Boton
            variante="secundario"
            tamano="md"
            cargando={cargandoReporte}
            icono={<RefreshCw className="h-3.5 w-3.5" strokeWidth={1.75} />}
            onClick={alRecargarDashboard}
          >
            Actualizar
          </Boton>
          <Link to="/actividades">
            <Boton variante="primario" tamano="md">
              Ir a actividades
            </Boton>
          </Link>
        </div>
      </div>

      {/* Tarjetas de métricas KPI */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaMetrica
          titulo="Proyectos"
          valor={resumen.totalProyectos}
          subtitulo="Activos y colaborativos"
          icono={<FolderKanban className="h-5 w-5" strokeWidth={1.75} />}
          acento="#0071E3"
        />
        <TarjetaMetrica
          titulo="Actividades completadas"
          valor={`${resumen.actividadesCompletadas}/${resumen.totalActividades}`}
          subtitulo={`${resumen.actividadesPendientes} pendientes · ${resumen.actividadesEnProgreso} en progreso`}
          icono={<CheckCircle2 className="h-5 w-5" strokeWidth={1.75} />}
          acento="#34C759"
        />
        <TarjetaMetrica
          titulo="Cumplimiento global"
          valor={`${resumen.porcentajeCumplimientoGlobal}%`}
          subtitulo="Promedio general de acciones"
          icono={<Target className="h-5 w-5" strokeWidth={1.75} />}
          acento="#5E5CE6"
        />
        <TarjetaMetrica
          titulo="Experiencia total"
          valor={`${resumen.experienciaTotal} XP`}
          subtitulo={`Nivel ${usuario?.nivel || 1} · Racha de ${usuario?.racha || 0} días`}
          icono={<Zap className="h-5 w-5" strokeWidth={1.75} />}
          acento="#FF9F0A"
        />
      </section>

      {/* Grid de 4 gráficos */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GraficoAvanceProyectos
          datos={reporteGeneral?.avancePorProyecto || []}
        />
        <GraficoEstadoActividades
          actividadesPorEstado={reporteGeneral?.actividadesPorEstado}
        />
        <GraficoProgresoAcciones
          datos={reporteGeneral?.progresoPorAccion || []}
        />
        <GraficoHistorialCumplimiento
          datos={reporteGeneral?.historialPorFecha || []}
        />
      </section>

      {/* Widget de completado rápido */}
      <section className="apple-card rounded-2xl p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="apple-heading text-base font-semibold text-[#1D1D1F] dark:text-white">
              Acciones listas para completar
            </h2>
            <p className="mt-0.5 text-xs text-[#6E6E73] dark:text-zinc-400">
              Completa una tarea única o registra un ciclo en tus actividades
              recurrentes.
            </p>
          </div>
          <Link
            to="/actividades"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#0071E3] dark:text-[#409CFF] hover:underline"
          >
            Ver todas <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
          </Link>
        </div>

        {actividadesRapidas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.02] p-6 text-center text-xs text-[#6E6E73] dark:text-zinc-400">
            No tienes actividades pendientes por ahora. Crea una nueva desde la
            sección Actividades.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {actividadesRapidas.map((actividad) => (
              <TarjetaActividad
                key={actividad.id}
                actividad={actividad}
                completando={idCompletando === actividad.id}
                alCompletar={alCompletarRapido}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
