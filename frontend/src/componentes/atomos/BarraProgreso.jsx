export function BarraProgreso({
  porcentaje = 0,
  color = '#0071E3',
  altura = 'h-2',
  mostrarEtiqueta = false,
  etiqueta = '',
  className = '',
}) {
  const valorSeguro = Math.min(100, Math.max(0, Number(porcentaje) || 0));

  return (
    <div className={`w-full ${className}`}>
      {mostrarEtiqueta && (
        <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-[#6E6E73] dark:text-zinc-400">
          <span>{etiqueta}</span>
          <span className="tabular-nums font-semibold text-[#1D1D1F] dark:text-zinc-100">
            {valorSeguro}%
          </span>
        </div>
      )}
      <div
        className={`w-full overflow-hidden rounded-full bg-black/[0.08] dark:bg-white/[0.1] ${altura}`}
        role="progressbar"
        aria-valuenow={valorSeguro}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="barra-progreso-relleno h-full w-full rounded-full"
          style={{
            backgroundColor: color,
            transform: `scaleX(${valorSeguro / 100})`,
          }}
        />
      </div>
    </div>
  );
}
