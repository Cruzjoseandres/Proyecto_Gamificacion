import { Award, Check, Flame, Lock, Target, Trophy, Zap } from 'lucide-react';
import { BarraProgreso } from '../atomos/BarraProgreso';
import { Insignia } from '../atomos/Insignia';

const ICONOS_MEDALLA = {
  PRIMER_PASO: Target,
  CONSTANCIA_100: Flame,
  EXPERTO_300: Zap,
  MAESTRO_500: Trophy,
};

export function TarjetaMedalla({
  medalla,
  desbloqueada = false,
  fechaDesbloqueo = null,
  experienciaUsuario = 0,
}) {
  const Icono = ICONOS_MEDALLA[medalla.codigo] || Award;
  const meta = Math.max(1, Number(medalla.experienciaRequerida) || 1);
  const porcentajeMeta = Math.min(
    100,
    Math.round((experienciaUsuario / meta) * 100),
  );

  return (
    <div
      className={`apple-card apple-card-interactiva rounded-2xl p-5 transition-opacity ${
        desbloqueada ? '' : 'opacity-80'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
            desbloqueada
              ? 'border-[#0071E3]/25 bg-[#0071E3]/10 text-[#0071E3] dark:border-[#0A84FF]/30 dark:bg-[#0A84FF]/15 dark:text-[#409CFF]'
              : 'border-black/[0.06] dark:border-white/[0.08] bg-black/[0.04] dark:bg-white/[0.05] text-[#6E6E73] dark:text-zinc-400'
          }`}
        >
          <Icono className="h-5 w-5" strokeWidth={1.75} />
        </div>

        {desbloqueada ? (
          <Insignia variante="esmeralda">
            <Check className="h-3 w-3" strokeWidth={2} />
            Desbloqueada
          </Insignia>
        ) : (
          <Insignia variante="gris">
            <Lock className="h-3 w-3" strokeWidth={1.75} />
            Pendiente
          </Insignia>
        )}
      </div>

      <div className="mt-4">
        <h3 className="apple-heading text-base font-semibold text-[#1D1D1F] dark:text-white">
          {medalla.nombre}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-[#6E6E73] dark:text-zinc-400">
          {medalla.descripcion}
        </p>
      </div>

      <div className="mt-4 space-y-2 border-t border-black/[0.06] dark:border-white/[0.08] pt-3">
        <BarraProgreso
          porcentaje={desbloqueada ? 100 : porcentajeMeta}
          color={desbloqueada ? '#34C759' : '#0071E3'}
          altura="h-1.5"
        />

        <div className="flex items-center justify-between text-[11px]">
          <span className="tabular-nums font-semibold text-[#1D1D1F] dark:text-zinc-200">
            Meta: {medalla.experienciaRequerida} XP
          </span>
          {desbloqueada && fechaDesbloqueo ? (
            <span className="tabular-nums text-[#6E6E73] dark:text-zinc-400">
              {new Date(fechaDesbloqueo).toLocaleDateString('es-ES')}
            </span>
          ) : (
            <span className="tabular-nums text-[#6E6E73] dark:text-zinc-400">
              {porcentajeMeta}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
