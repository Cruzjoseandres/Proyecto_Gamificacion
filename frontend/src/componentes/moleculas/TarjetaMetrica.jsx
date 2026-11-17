export function TarjetaMetrica({
  titulo,
  valor,
  subtitulo = '',
  icono = null,
  acento = '#0071E3',
}) {
  return (
    <div className="apple-card apple-card-interactiva rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="apple-overline text-[11px] font-semibold uppercase text-[#6E6E73] dark:text-zinc-400">
            {titulo}
          </p>
          <p className="apple-heading tabular-nums mt-2.5 text-3xl font-semibold text-[#1D1D1F] dark:text-white">
            {valor}
          </p>
          {subtitulo && (
            <p className="mt-1.5 truncate text-xs text-[#6E6E73] dark:text-zinc-400">
              {subtitulo}
            </p>
          )}
        </div>

        {icono && (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/[0.04] dark:border-white/[0.06]"
            style={{
              backgroundColor: `${acento}16`,
              color: acento,
            }}
          >
            {icono}
          </div>
        )}
      </div>
    </div>
  );
}
