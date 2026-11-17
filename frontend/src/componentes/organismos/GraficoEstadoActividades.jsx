import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const CONFIG_ESTADOS = [
  { clave: 'completadas', nombre: 'Completadas', color: '#34C759' },
  { clave: 'enProgreso', nombre: 'En Progreso', color: '#0071E3' },
  { clave: 'pendientes', nombre: 'Pendientes', color: '#FF9F0A' },
  { clave: 'canceladas', nombre: 'Canceladas', color: '#8E8E93' },
];

function TooltipEstado({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;

  return (
    <div className="rounded-xl border border-black/[0.08] dark:border-white/[0.12] bg-white/95 dark:bg-[#1C1C21]/95 px-3 py-2 text-xs shadow-lg backdrop-blur-md">
      <p className="font-semibold text-[#1D1D1F] dark:text-white">
        {item.nombre}
      </p>
      <p className="tabular-nums text-[#6E6E73] dark:text-zinc-300">
        {item.valor} {item.valor === 1 ? 'actividad' : 'actividades'}
      </p>
    </div>
  );
}

export function GraficoEstadoActividades({ actividadesPorEstado }) {
  const estados = actividadesPorEstado || {
    completadas: 0,
    enProgreso: 0,
    pendientes: 0,
    canceladas: 0,
  };

  const datos = CONFIG_ESTADOS.map((item) => ({
    nombre: item.nombre,
    valor: estados[item.clave] || 0,
    color: item.color,
  })).filter((item) => item.valor > 0);

  const total = datos.reduce((acc, item) => acc + item.valor, 0);

  return (
    <div className="apple-card rounded-2xl p-5">
      <div className="mb-4">
        <h3 className="apple-heading text-base font-semibold text-[#1D1D1F] dark:text-white">
          Estado de Actividades
        </h3>
        <p className="mt-0.5 text-xs text-[#6E6E73] dark:text-zinc-400">
          Distribución actual entre pendientes, en progreso y completadas
        </p>
      </div>

      {total === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.02] text-xs text-[#6E6E73] dark:text-zinc-400">
          Aún no hay actividades registradas.
        </div>
      ) : (
        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
          <div className="relative h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datos}
                  dataKey="valor"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={82}
                  paddingAngle={3}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {datos.map((entrada) => (
                    <Cell key={entrada.nombre} fill={entrada.color} />
                  ))}
                </Pie>
                <Tooltip content={<TooltipEstado />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="apple-heading tabular-nums text-2xl font-semibold text-[#1D1D1F] dark:text-white">
                {total}
              </span>
              <span className="text-[11px] font-medium text-[#6E6E73] dark:text-zinc-400">
                Total
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {CONFIG_ESTADOS.map((item) => {
              const cantidad = estados[item.clave] || 0;
              const porcentaje =
                total > 0 ? Math.round((cantidad / total) * 100) : 0;

              return (
                <div
                  key={item.clave}
                  className="flex items-center justify-between rounded-xl bg-black/[0.03] dark:bg-white/[0.05] px-3 py-2 text-xs"
                >
                  <span className="flex items-center gap-2 font-medium text-[#1D1D1F] dark:text-zinc-200">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.nombre}
                  </span>
                  <span className="tabular-nums font-semibold text-[#1D1D1F] dark:text-white">
                    {cantidad}{' '}
                    <span className="font-normal text-[#6E6E73] dark:text-zinc-400">
                      ({porcentaje}%)
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
