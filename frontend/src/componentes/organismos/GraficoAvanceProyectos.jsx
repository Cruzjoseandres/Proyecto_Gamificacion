import { useSelector } from 'react-redux';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function TooltipProyecto({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;

  return (
    <div className="rounded-xl border border-black/[0.08] dark:border-white/[0.12] bg-white/95 dark:bg-[#1C1C21]/95 px-3.5 py-2.5 text-xs shadow-lg backdrop-blur-md">
      <p className="font-semibold text-[#1D1D1F] dark:text-white">
        {item.nombre}
      </p>
      <p className="tabular-nums mt-1 text-[#6E6E73] dark:text-zinc-300">
        Avance:{' '}
        <span className="font-semibold text-[#0071E3] dark:text-[#409CFF]">
          {item.porcentajeAvance}%
        </span>
      </p>
      <p className="tabular-nums text-[#6E6E73] dark:text-zinc-400">
        Completadas: {item.completadas} / {item.totalActividades}
      </p>
    </div>
  );
}

export function GraficoAvanceProyectos({ datos = [] }) {
  const temaOscuro = useSelector((state) => state.autenticacion.temaOscuro);
  const colorGrid = temaOscuro ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const colorTexto = temaOscuro ? '#A1A1AA' : '#6E6E73';

  return (
    <div className="apple-card rounded-2xl p-5">
      <div className="mb-4">
        <h3 className="apple-heading text-base font-semibold text-[#1D1D1F] dark:text-white">
          Avance por Proyecto
        </h3>
        <p className="mt-0.5 text-xs text-[#6E6E73] dark:text-zinc-400">
          Porcentaje de cumplimiento de actividades por proyecto
        </p>
      </div>

      {datos.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.02] text-xs text-[#6E6E73] dark:text-zinc-400">
          Crea un proyecto para visualizar su avance aquí.
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={datos}
              margin={{ top: 8, right: 12, left: -12, bottom: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={colorGrid}
              />
              <XAxis
                dataKey="nombre"
                tick={{ fontSize: 11, fill: colorTexto }}
                tickFormatter={(valor) =>
                  valor.length > 14 ? `${valor.slice(0, 14)}…` : valor
                }
                axisLine={{ stroke: colorGrid }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                unit="%"
                tick={{ fontSize: 11, fill: colorTexto }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<TooltipProyecto />} cursor={{ fill: colorGrid }} />
              <Bar
                dataKey="porcentajeAvance"
                radius={[8, 8, 0, 0]}
                maxBarSize={44}
                isAnimationActive={false}
              >
                {datos.map((entrada) => (
                  <Cell
                    key={entrada.proyectoId}
                    fill={entrada.color || '#0071E3'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
