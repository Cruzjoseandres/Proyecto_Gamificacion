import { Award, Flame, LogOut, Menu, Moon, Sparkles, Sun, Zap } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  alternarTemaOscuro,
  cerrarSesion,
} from '../../store/slices/autenticacion.slice';
import { BarraProgreso } from '../atomos/BarraProgreso';

function obtenerIniciales(usuario) {
  const texto = usuario?.nombre || usuario?.correo || 'U';
  return texto
    .split(' ')
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() || '')
    .join('');
}

export function EncabezadoGamificado({ alAbrirMenu }) {
  const dispatch = useDispatch();
  const { usuario, temaOscuro } = useSelector((state) => state.autenticacion);

  const experiencia = usuario?.experiencia || 0;
  const nivel = usuario?.nivel || 1;
  const racha = usuario?.racha || 0;
  const xpNivelActual = experiencia % 100;
  const totalMedallas = (usuario?.medallasUsuario || []).length;

  return (
    <header className="apple-glass sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-black/[0.07] dark:border-white/[0.08] px-4 sm:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={alAbrirMenu}
          aria-label="Abrir menú"
          className="btn-interactivo rounded-xl border border-black/[0.08] dark:border-white/[0.1] p-2 text-[#1D1D1F] dark:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/10 lg:hidden cursor-pointer"
        >
          <Menu className="h-4 w-4" strokeWidth={1.75} />
        </button>

        <div className="flex items-center gap-2.5 min-w-0">
          <div className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0071E3]/12 dark:bg-[#0A84FF]/20 text-xs font-semibold text-[#0071E3] dark:text-[#409CFF]">
            {obtenerIniciales(usuario)}
          </div>
          <div className="min-w-0 leading-tight">
            <p className="apple-overline text-[10px] font-semibold uppercase text-[#6E6E73] dark:text-zinc-400">
              Cuenta activa
            </p>
            <h2 className="truncate text-sm font-semibold text-[#1D1D1F] dark:text-zinc-100 max-w-[150px] sm:max-w-[220px]">
              {usuario?.nombre || usuario?.correo || 'Usuario'}
            </h2>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Cápsula unificada Apple con iconos finos y métricas tabulares */}
        <div className="hidden lg:flex h-9 items-center gap-3 rounded-full border border-black/[0.07] dark:border-white/[0.09] bg-black/[0.035] dark:bg-white/[0.06] px-3.5 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles
              className="h-3.5 w-3.5 text-[#0071E3] dark:text-[#409CFF]"
              strokeWidth={1.75}
            />
            <span className="tabular-nums font-semibold text-[#1D1D1F] dark:text-zinc-100">
              Nivel {nivel}
            </span>
            <div className="w-18">
              <BarraProgreso
                porcentaje={xpNivelActual}
                color="#0071E3"
                altura="h-1.5"
              />
            </div>
            <span className="tabular-nums text-[11px] font-medium text-[#6E6E73] dark:text-zinc-400">
              {xpNivelActual}/100
            </span>
          </div>

          <span className="h-3.5 w-px bg-black/10 dark:bg-white/10" />

          <span className="tabular-nums inline-flex items-center gap-1 font-medium text-[#1D1D1F] dark:text-zinc-200">
            <Zap className="h-3.5 w-3.5 text-amber-500" strokeWidth={1.75} />
            {experiencia} XP
          </span>

          <span className="h-3.5 w-px bg-black/10 dark:bg-white/10" />

          <span className="tabular-nums inline-flex items-center gap-1 font-medium text-[#6E6E73] dark:text-zinc-300">
            <Flame className="h-3.5 w-3.5 text-orange-500" strokeWidth={1.75} />
            {racha} {racha === 1 ? 'día' : 'días'}
          </span>

          <span className="h-3.5 w-px bg-black/10 dark:bg-white/10" />

          <span className="tabular-nums inline-flex items-center gap-1 font-medium text-[#6E6E73] dark:text-zinc-300">
            <Award
              className="h-3.5 w-3.5 text-emerald-500"
              strokeWidth={1.75}
            />
            {totalMedallas}
          </span>
        </div>

        {/* Selector de Modo Oscuro / Claro */}
        <button
          type="button"
          onClick={() => dispatch(alternarTemaOscuro())}
          aria-label={temaOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          className="btn-interactivo inline-flex h-9 items-center gap-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.035] dark:bg-white/[0.07] px-3 text-xs font-medium text-[#1D1D1F] dark:text-zinc-100 hover:bg-black/[0.07] dark:hover:bg-white/[0.12] cursor-pointer"
        >
          {temaOscuro ? (
            <>
              <Sun className="h-3.5 w-3.5 text-amber-400" strokeWidth={1.75} />
              <span className="hidden sm:inline">Claro</span>
            </>
          ) : (
            <>
              <Moon className="h-3.5 w-3.5 text-zinc-700" strokeWidth={1.75} />
              <span className="hidden sm:inline">Oscuro</span>
            </>
          )}
        </button>

        {/* Botón Salir */}
        <button
          type="button"
          onClick={() => dispatch(cerrarSesion())}
          className="btn-interactivo inline-flex h-9 items-center gap-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-white/80 dark:bg-white/[0.05] px-3 text-xs font-medium text-[#1D1D1F] dark:text-zinc-200 hover:bg-black/[0.05] dark:hover:bg-white/[0.1] cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  );
}
