import { useSelector } from 'react-redux';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function TooltipHistorial({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const fila = payload[0].payload;

  return (
    <div className="rounded-xl border border-black/[0.08] dark:border-white/[0.12] bg-white/95 dark:bg-[#1C1C21]/95 px-3.5 py-2.5 text-xs shadow-lg backdrop-blur-md">
      <p className="tabular-nums font-semibold text-[#1D1D1F] dark:text-white">
        {label}
      </p>
      <p className="tabular-nums mt-1 font-semibold text-[#0071E3] dark:text-[#409CFF]">
        XP ganada: +{fila.experienciaGanada} XP
      </p>
      <p className="tabular-nums text-emerald-600 dark:text-emerald-400">
        Actividades completadas: {fila.actividadesCompletadas}
      </p>
    </div>
  );
}

export function GraficoHistorialCumplimiento({ datos = [] }) {
  const temaOscuro = useSelector((state) => state.autenticacion.temaOscuro);
  const colorGrid = temaOscuro ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const colorTexto = temaOscuro ? '#A1A1AA' : '#6E6E73';
  const colorLinea = temaOscuro ? '#0A84FF' : '#0071E3';

  return (
    <div className="apple-card rounded-2xl p-5">
      <div className="mb-4">
        <h3 className="apple-heading text-base font-semibold text-[#1D1D1F] dark:text-white">
          Historial de Cumplimiento y XP
        </h3>
        <p className="mt-0.5 text-xs text-[#6E6E73] dark:text-zinc-400">
          Evolución diaria de experiencia acumulada y acciones completadas
        </p>
      </div>

      {datos.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.02] text-xs text-[#6E6E73] dark:text-zinc-400">
          Completa actividades para generar la curva de progreso por fecha.
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={datos}
              margin={{ top: 10, right: 12, left: -12, bottom: 4 }}
            >
              <defs>
                <linearGradient id="degradadoXp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colorLinea} stopOpacity={0.32} />
                  <stop offset="95%" stopColor={colorLinea} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={colorGrid}
              />
              <XAxis
                dataKey="fecha"
                tick={{ fontSize: 11, fill: colorTexto }}
                axisLine={{ stroke: colorGrid }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: colorTexto }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<TooltipHistorial />} />
              <Area
                type="monotone"
                dataKey="experienciaGanada"
                stroke={colorLinea}
                strokeWidth={2.25}
                fillOpacity={1}
                fill="url(#degradadoXp)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
