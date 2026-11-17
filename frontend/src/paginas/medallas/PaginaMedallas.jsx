import { Award, Flame, Trophy, Zap } from 'lucide-react';
import { BarraProgreso } from '../../componentes/atomos/BarraProgreso';
import { TarjetaMedalla } from '../../componentes/moleculas/TarjetaMedalla';
import { useMedallas } from './useMedallas';

export function PaginaMedallas() {
  const {
    usuario,
    experiencia,
    nivel,
    xpNivelActual,
    catalogoMedallas,
    mapaDesbloqueadas,
    listaUsuarios,
  } = useMedallas();

  const totalDesbloqueadas = mapaDesbloqueadas.size;

  return (
    <div className="vista-animada space-y-6">
      <div>
        <h1 className="apple-heading text-2xl font-semibold text-[#1D1D1F] dark:text-white">
          Logros y Clasificación
        </h1>
        <p className="mt-1 text-xs text-[#6E6E73] dark:text-zinc-400">
          Revisa tus metas desbloqueadas y compara tu desempeño en el ranking
          general.
        </p>
      </div>

      {/* Banner de progreso del jugador */}
      <section className="apple-card rounded-3xl p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0071E3]/10 dark:bg-[#0A84FF]/15 px-3 py-1 text-[11px] font-semibold text-[#0071E3] dark:text-[#409CFF]">
              <Trophy className="h-3.5 w-3.5" strokeWidth={1.75} />
              Perfil de jugador
            </span>
            <h2 className="apple-heading mt-3 text-2xl font-semibold text-[#1D1D1F] dark:text-white">
              {usuario?.nombre || usuario?.correo}
            </h2>
            <p className="tabular-nums mt-1 text-xs text-[#6E6E73] dark:text-zinc-400">
              Nivel {nivel} · {experiencia} XP acumulados · Racha de{' '}
              {usuario?.racha || 0} días
            </p>
          </div>

          <div className="w-full max-w-sm rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.025] dark:bg-white/[0.04] p-4">
            <div className="mb-2 flex items-center justify-between text-xs font-medium text-[#1D1D1F] dark:text-zinc-200">
              <span>Progreso hacia Nivel {nivel + 1}</span>
              <span className="tabular-nums font-semibold">
                {xpNivelActual} / 100 XP
              </span>
            </div>
            <BarraProgreso
              porcentaje={xpNivelActual}
              color="#0071E3"
              altura="h-2"
            />
            <p className="tabular-nums mt-2 text-[11px] text-[#6E6E73] dark:text-zinc-400">
              Logros desbloqueados: {totalDesbloqueadas} /{' '}
              {catalogoMedallas.length}
            </p>
          </div>
        </div>
      </section>

      {/* Catálogo de Medallas */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Award
            className="h-4 w-4 text-[#0071E3] dark:text-[#409CFF]"
            strokeWidth={1.75}
          />
          <h2 className="apple-heading text-base font-semibold text-[#1D1D1F] dark:text-white">
            Catálogo de Logros
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {catalogoMedallas.map((medalla) => {
            const desbloqueada = mapaDesbloqueadas.has(medalla.id);
            const fechaDesbloqueo = mapaDesbloqueadas.get(medalla.id);
            return (
              <TarjetaMedalla
                key={medalla.id}
                medalla={medalla}
                desbloqueada={desbloqueada}
                fechaDesbloqueo={fechaDesbloqueo}
                experienciaUsuario={experiencia}
              />
            );
          })}
        </div>
      </section>

      {/* Ranking / Leaderboard */}
      <section className="apple-card rounded-2xl p-5">
        <div className="mb-4 flex items-center gap-2">
          <Trophy
            className="h-4 w-4 text-[#0071E3] dark:text-[#409CFF]"
            strokeWidth={1.75}
          />
          <div>
            <h2 className="apple-heading text-base font-semibold text-[#1D1D1F] dark:text-white">
              Tabla de Posiciones
            </h2>
            <p className="mt-0.5 text-xs text-[#6E6E73] dark:text-zinc-400">
              Clasificación ordenada por experiencia total acumulada
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="apple-overline border-b border-black/[0.06] dark:border-white/[0.08] text-[11px] font-semibold uppercase text-[#6E6E73] dark:text-zinc-400">
                <th className="px-3 py-3">Puesto</th>
                <th className="px-3 py-3">Participante</th>
                <th className="px-3 py-3">Nivel</th>
                <th className="px-3 py-3">Racha</th>
                <th className="px-3 py-3 text-right">Experiencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
              {listaUsuarios.map((jugador, indice) => {
                const esActual = jugador.id === usuario?.id;
                const puestoFormateado = String(indice + 1).padStart(2, '0');
                const clasePuesto =
                  indice === 0
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300'
                    : indice === 1
                      ? 'border-zinc-400/30 bg-zinc-400/10 text-zinc-600 dark:text-zinc-300'
                      : indice === 2
                        ? 'border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-300'
                        : 'border-black/[0.06] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.05] text-[#6E6E73] dark:text-zinc-400';

                return (
                  <tr
                    key={jugador.id}
                    className={
                      esActual
                        ? 'bg-[#0071E3]/[0.06] dark:bg-[#0A84FF]/[0.1]'
                        : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.03]'
                    }
                  >
                    <td className="px-3 py-3">
                      <span
                        className={`tabular-nums inline-flex h-6 w-7 items-center justify-center rounded-md border text-[11px] font-semibold ${clasePuesto}`}
                      >
                        {puestoFormateado}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-sm font-semibold text-[#1D1D1F] dark:text-white">
                        {jugador.nombre || jugador.correo}
                        {esActual && (
                          <span className="ml-2 rounded-full bg-[#0071E3]/15 px-2 py-0.5 text-[10px] font-semibold text-[#0071E3] dark:text-[#409CFF]">
                            Tú
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-[#6E6E73] dark:text-zinc-400">
                        {jugador.correo}
                      </p>
                    </td>
                    <td className="tabular-nums px-3 py-3 text-xs font-semibold text-[#1D1D1F] dark:text-zinc-200">
                      Nivel {jugador.nivel}
                    </td>
                    <td className="tabular-nums px-3 py-3 text-xs text-[#6E6E73] dark:text-zinc-400">
                      <span className="inline-flex items-center gap-1">
                        <Flame
                          className="h-3.5 w-3.5 text-orange-500"
                          strokeWidth={1.75}
                        />
                        {jugador.racha} {jugador.racha === 1 ? 'día' : 'días'}
                      </span>
                    </td>
                    <td className="tabular-nums px-3 py-3 text-right text-xs font-semibold text-[#0071E3] dark:text-[#409CFF]">
                      <span className="inline-flex items-center justify-end gap-1">
                        <Zap
                          className="h-3.5 w-3.5 text-amber-500"
                          strokeWidth={1.75}
                        />
                        {jugador.experiencia} XP
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
