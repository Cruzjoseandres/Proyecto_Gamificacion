const COLORES_INSIGNIA = {
  indigo:
    'bg-[#0071E3]/10 text-[#0071E3] dark:bg-[#0A84FF]/15 dark:text-[#409CFF] border-[#0071E3]/20',
  violeta:
    'bg-violet-500/10 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300 border-violet-500/20',
  ambar:
    'bg-amber-500/10 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300 border-amber-500/20',
  azul:
    'bg-sky-500/10 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300 border-sky-500/20',
  esmeralda:
    'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300 border-emerald-500/20',
  rosa:
    'bg-rose-500/10 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300 border-rose-500/20',
  gris:
    'bg-black/[0.05] text-[#6E6E73] dark:bg-white/[0.08] dark:text-zinc-300 border-black/[0.06] dark:border-white/[0.08]',
};

export function Insignia({ children, variante = 'gris', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap ${COLORES_INSIGNIA[variante] || COLORES_INSIGNIA.gris} ${className}`}
    >
      {children}
    </span>
  );
}
