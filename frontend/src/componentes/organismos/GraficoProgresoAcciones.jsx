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
import { ETIQUETAS_TIPO } from '../../constantes/enums';
import { BarraProgreso } from '../atomos/BarraProgreso';

function TooltipAccion({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const accion = payload[0].payload;

  return (
    <div className="rounded-xl border border-black/[0.08] dark:border-white/[0.12] bg-white/95 dark:bg-[#1C1C21]/95 px-3.5 py-2.5 text-xs shadow-lg backdrop-blur-md max-w-xs">
      <p className="font-semibold text-[#1D1D1F] dark:text-white break-words">
        {accion.titulo}
      </p>
      <p className="text-[#6E6E73] dark:text-zinc-400">
        {accion.proyectoNombre || 'Personal'} ·{' '}
        {ETIQUETAS_TIPO[accion.tipo] || accion.tipo}
      </p>
      <div className="tabular-nums mt-1.5 space-y-0.5 text-[#1D1D1F] dark:text-zinc-200">
        <p>Avance: {accion.porcentajeAvance}%</p>
        <p>Veces completada: {accion.vecesCompletada}</p>
        <p className="font-semibold text-[#0071E3] dark:text-[#409CFF]">
          XP generada: +{accion.experienciaGenerada} XP
        </p>
      </div>
    </div>
  );
}

export function GraficoProgresoAcciones({
  datos = [],
  titulo = 'Progreso por Cada Acción',
  subtitulo = 'Avance individual y experiencia generada por cada actividad',
}) {
  const temaOscuro = useSelector((state) => state.autenticacion.temaOscuro);
  const colorGrid = temaOscuro ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const colorTexto = temaOscuro ? '#A1A1AA' : '#6E6E73';
  const accionesVisibles = datos.slice(0, 8);

  return (
    <div className="apple-card rounded-2xl p-5">
      <div className="mb-4">
        <h3 className="apple-heading text-base font-semibold text-[#1D1D1F] dark:text-white">
          {titulo}
        </h3>
        <p className="mt-0.5 text-xs text-[#6E6E73] dark:text-zinc-400">
          {subtitulo}
        </p>
      </div>

      {accionesVisibles.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.02] text-xs text-[#6E6E73] dark:text-zinc-400">
          Crea y completa actividades para ver el progreso de cada acción.
        </div>
      ) : (
        <div className="space-y-5">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={accionesVisibles}
                margin={{ top: 8, right: 12, left: -12, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={colorGrid}
                />
                <XAxis
                  dataKey="titulo"
                  tick={{ fontSize: 11, fill: colorTexto }}
                  tickFormatter={(valor) =>
                    valor.length > 12 ? `${valor.slice(0, 12)}…` : valor
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
                <Tooltip content={<TooltipAccion />} cursor={{ fill: colorGrid }} />
                <Bar
                  dataKey="porcentajeAvance"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={40}
                  isAnimationActive={false}
                >
                  {accionesVisibles.map((accion) => (
                    <Cell
                      key={accion.id}
                      fill={accion.colorProyecto || '#0071E3'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 border-t border-black/[0.06] dark:border-white/[0.08] pt-4 max-h-56 overflow-y-auto pr-1">
            {datos.map((accion) => (
              <div
                key={accion.id}
                className="rounded-xl bg-black/[0.03] dark:bg-white/[0.04] px-3 py-2.5"
              >
                <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
                  <span className="truncate font-medium text-[#1D1D1F] dark:text-zinc-200">
                    {accion.titulo}
                  </span>
                  <span className="tabular-nums shrink-0 font-semibold text-[#0071E3] dark:text-[#409CFF]">
                    +{accion.experienciaGenerada} XP · {accion.vecesCompletada}x
                  </span>
                </div>
                <BarraProgreso
                  porcentaje={accion.porcentajeAvance}
                  color={accion.colorProyecto || '#0071E3'}
                  altura="h-1.5"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
