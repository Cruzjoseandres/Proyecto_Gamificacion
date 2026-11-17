export function ControlSegmentado({
  etiqueta = '',
  opciones = [],
  value,
  onChange,
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {etiqueta && (
        <span className="apple-overline text-[11px] font-semibold uppercase text-[#6E6E73] dark:text-zinc-400">
          {etiqueta}
        </span>
      )}
      <div className="inline-flex w-full rounded-xl bg-black/[0.05] dark:bg-white/[0.07] p-1 gap-1">
        {opciones.map((opcion) => {
          const activo = String(opcion.valor) === String(value);
          return (
            <button
              key={opcion.valor}
              type="button"
              onClick={() => onChange && onChange(opcion.valor)}
              className={`btn-interactivo flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium cursor-pointer whitespace-nowrap ${
                activo
                  ? 'bg-white dark:bg-[#26262C] text-[#1D1D1F] dark:text-white font-semibold shadow-xs'
                  : 'text-[#6E6E73] dark:text-zinc-400 hover:text-[#1D1D1F] dark:hover:text-zinc-200'
              }`}
            >
              {opcion.icono && (
                <span className="shrink-0 flex items-center">{opcion.icono}</span>
              )}
              <span className="tabular-nums">{opcion.etiqueta}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

