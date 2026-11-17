import {
  Award,
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const ENLACES = [
  {
    ruta: '/dashboard',
    etiqueta: 'Resumen',
    icono: LayoutDashboard,
  },
  {
    ruta: '/proyectos',
    etiqueta: 'Proyectos',
    icono: FolderKanban,
  },
  {
    ruta: '/actividades',
    etiqueta: 'Actividades',
    icono: CheckSquare,
  },
  {
    ruta: '/medallas',
    etiqueta: 'Logros y Ranking',
    icono: Award,
  },
];

export function BarraLateral({ abiertoMovil, alCerrarMovil }) {
  return (
    <>
      {abiertoMovil && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={alCerrarMovil}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-black/[0.07] dark:border-white/[0.08] bg-white/90 dark:bg-[#111114]/95 backdrop-blur-xl transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0 ${
          abiertoMovil ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Altura fija h-16 para alinear la línea divisoria exactamente con la cabecera */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-black/[0.07] dark:border-white/[0.08] px-5">
          <div className="flex items-center gap-2.5">
            <svg
              viewBox="0 0 28 28"
              className="h-7 w-7 shrink-0 text-[#1D1D1F] dark:text-white"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="1.5"
                y="1.5"
                width="25"
                height="25"
                rx="7"
                className="stroke-current/15 fill-black/[0.04] dark:fill-white/[0.08]"
                strokeWidth="1.5"
              />
              <circle
                cx="14"
                cy="14"
                r="6"
                stroke="currentColor"
                strokeWidth="1.75"
              />
              <circle cx="14" cy="14" r="2.25" fill="#0071E3" />
            </svg>
            <div className="leading-none">
              <h1 className="apple-heading text-[15px] font-semibold text-[#1D1D1F] dark:text-white">
                QuestFlow
              </h1>
              <p className="mt-0.5 text-[11px] font-medium text-[#6E6E73] dark:text-zinc-400">
                Espacio de trabajo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={alCerrarMovil}
            aria-label="Cerrar menú"
            className="btn-interactivo rounded-lg p-1.5 text-zinc-500 hover:bg-black/5 dark:hover:bg-white/10 lg:hidden cursor-pointer"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-1 px-3 py-4">
          <p className="apple-overline px-3 pb-1.5 text-[10px] font-semibold uppercase text-[#6E6E73] dark:text-zinc-500">
            Navegación
          </p>
          {ENLACES.map((enlace) => {
            const Icono = enlace.icono;
            return (
              <NavLink
                key={enlace.ruta}
                to={enlace.ruta}
                onClick={alCerrarMovil}
                className={({ isActive }) =>
                  `btn-interactivo flex h-9 items-center gap-2.5 rounded-xl px-3 text-[13px] ${
                    isActive
                      ? 'bg-black/[0.06] dark:bg-white/[0.11] text-[#1D1D1F] dark:text-white font-semibold'
                      : 'text-[#6E6E73] dark:text-zinc-400 font-medium hover:bg-black/[0.035] dark:hover:bg-white/[0.05] hover:text-[#1D1D1F] dark:hover:text-zinc-100'
                  }`
                }
              >
                <Icono className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                <span>{enlace.etiqueta}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-black/[0.07] dark:border-white/[0.08] p-4">
          <div className="rounded-2xl bg-black/[0.035] dark:bg-white/[0.04] p-3.5 text-xs">
            <p className="font-semibold text-[#1D1D1F] dark:text-zinc-200">
              Sistema de niveles
            </p>
            <p className="mt-1 leading-relaxed text-[#6E6E73] dark:text-zinc-400">
              Cada <span className="tabular-nums font-semibold">100 XP</span>{' '}
              acumulados avanzas al siguiente nivel y desbloqueas logros.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
