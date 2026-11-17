export function CampoTexto({
  etiqueta,
  id,
  error,
  multilinea = false,
  filas = 3,
  icono = null,
  className = '',
  ...resto
}) {
  const clasesBase =
    'w-full rounded-xl border border-black/[0.11] dark:border-white/[0.12] bg-white dark:bg-[#1C1C22] py-2.5 text-base sm:text-sm text-[#1D1D1F] dark:text-zinc-100 placeholder:text-[#86868B] dark:placeholder:text-zinc-500 focus:border-[#0071E3] focus:outline-none focus:ring-3 focus:ring-[#0071E3]/20 disabled:bg-black/[0.04] dark:disabled:bg-white/[0.04] disabled:text-zinc-500';

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {etiqueta && (
        <label
          htmlFor={id}
          className="apple-overline text-[11px] font-semibold uppercase text-[#6E6E73] dark:text-zinc-400"
        >
          {etiqueta}
        </label>
      )}

      {multilinea ? (
        <textarea
          id={id}
          rows={filas}
          className={`${clasesBase} resize-none px-3.5`}
          {...resto}
        />
      ) : (
        <div className="relative flex items-center">
          {icono && (
            <span className="pointer-events-none absolute left-3.5 text-[#6E6E73] dark:text-zinc-400">
              {icono}
            </span>
          )}
          <input
            id={id}
            className={`${clasesBase} ${icono ? 'pl-10 pr-3.5' : 'px-3.5'}`}
            {...resto}
          />
        </div>
      )}

      {error && <span className="text-xs text-rose-500">{error}</span>}
    </div>
  );
}
