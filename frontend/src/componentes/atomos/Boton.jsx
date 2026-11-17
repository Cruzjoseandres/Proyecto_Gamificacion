import { Loader2 } from 'lucide-react';

const VARIANTES = {
  primario:
    'bg-[#0071E3] text-white hover:bg-[#0077ED] border border-transparent shadow-2xs',
  secundario:
    'bg-black/[0.04] dark:bg-white/[0.08] text-[#1D1D1F] dark:text-zinc-100 hover:bg-black/[0.08] dark:hover:bg-white/[0.13] border border-black/[0.08] dark:border-white/[0.1]',
  exito:
    'bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-400 border border-transparent shadow-2xs',
  peligro:
    'bg-rose-600 dark:bg-rose-500 text-white hover:bg-rose-700 dark:hover:bg-rose-400 border border-transparent shadow-2xs',
  fantasma:
    'bg-transparent text-[#6E6E73] dark:text-zinc-400 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] hover:text-[#1D1D1F] dark:hover:text-zinc-100 border border-transparent',
};

const TAMANOS = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-full',
  md: 'h-9 px-4 text-[13px] gap-2 rounded-full',
  lg: 'h-11 px-5 text-sm gap-2 rounded-xl',
};

export function Boton({
  children,
  variante = 'primario',
  tamano = 'md',
  icono = null,
  cargando = false,
  disabled = false,
  className = '',
  type = 'button',
  ...resto
}) {
  return (
    <button
      type={type}
      disabled={disabled || cargando}
      className={`btn-interactivo inline-flex items-center justify-center font-medium cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${VARIANTES[variante] || VARIANTES.primario} ${TAMANOS[tamano] || TAMANOS.md} ${className}`}
      {...resto}
    >
      {cargando ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" strokeWidth={1.75} />
      ) : (
        icono && <span className="shrink-0 flex items-center">{icono}</span>
      )}
      {children}
    </button>
  );
}
