import { BarChart3, Trash2, UserPlus, Users } from 'lucide-react';
import { ETIQUETAS_ESTADO_PROYECTO } from '../../constantes/enums';
import { BarraProgreso } from '../atomos/BarraProgreso';
import { Boton } from '../atomos/Boton';
import { Insignia } from '../atomos/Insignia';

const VARIANTE_ESTADO = {
  ACTIVO: 'esmeralda',
  COMPLETADO: 'indigo',
  ARCHIVADO: 'gris',
};

function obtenerIniciales(usuario) {
  const texto = usuario?.nombre || usuario?.correo || 'U';
  return texto
    .split(' ')
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() || '')
    .join('');
}

export function TarjetaProyecto({
  proyecto,
  seleccionado = false,
  alSeleccionar,
  alAbrirVincular,
  alEliminar,
}) {
  const color = proyecto.color || '#0071E3';
  const miembros = proyecto.miembros || [];

  return (
    <div
      className={`apple-card apple-card-interactiva flex flex-col justify-between gap-4 rounded-2xl p-5 transition-all ${
        seleccionado ? 'ring-2 ring-[#0071E3] border-transparent' : ''
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: color }}
            />
            <h3 className="apple-heading truncate text-base font-semibold text-[#1D1D1F] dark:text-white">
              {proyecto.nombre}
            </h3>
          </div>
          <Insignia variante={VARIANTE_ESTADO[proyecto.estado] || 'gris'}>
            {ETIQUETAS_ESTADO_PROYECTO[proyecto.estado] || proyecto.estado}
          </Insignia>
        </div>

        <p className="text-xs leading-relaxed text-[#6E6E73] dark:text-zinc-400 break-words line-clamp-2 min-h-[2.25rem]">
          {proyecto.descripcion ||
            'Sin descripción registrada para este proyecto.'}
        </p>

        <BarraProgreso
          porcentaje={proyecto.porcentajeAvance || 0}
          color={color}
          mostrarEtiqueta
          etiqueta={`Avance (${proyecto.actividadesCompletadas || 0}/${proyecto.totalActividades || 0})`}
        />

        <div className="flex items-center justify-between text-xs text-[#6E6E73] dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {miembros.slice(0, 3).map((m) => (
                <span
                  key={m.usuarioId}
                  title={m.usuario?.nombre || m.usuario?.correo}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white dark:border-[#141418] bg-black/[0.06] dark:bg-white/[0.12] text-[10px] font-semibold text-[#1D1D1F] dark:text-zinc-100"
                >
                  {obtenerIniciales(m.usuario)}
                </span>
              ))}
            </div>
            <span className="tabular-nums inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" strokeWidth={1.75} />
              {miembros.length}
            </span>
          </div>

          {proyecto.propietario && (
            <span className="truncate max-w-[140px]">
              Líder: {proyecto.propietario.nombre || proyecto.propietario.correo}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-black/[0.06] dark:border-white/[0.08] pt-3">
        <div className="flex items-center gap-2">
          <Boton
            variante={seleccionado ? 'primario' : 'secundario'}
            tamano="sm"
            icono={<BarChart3 className="h-3.5 w-3.5" strokeWidth={1.75} />}
            onClick={() => alSeleccionar(proyecto)}
          >
            {seleccionado ? 'Viendo reporte' : 'Ver detalle'}
          </Boton>
          <Boton
            variante="secundario"
            tamano="sm"
            icono={<UserPlus className="h-3.5 w-3.5" strokeWidth={1.75} />}
            onClick={() => alAbrirVincular(proyecto)}
          >
            Vincular
          </Boton>
        </div>

        {alEliminar && (
          <Boton
            variante="fantasma"
            tamano="sm"
            onClick={() => alEliminar(proyecto.id)}
            title="Eliminar proyecto"
            className="px-2 text-zinc-400 hover:text-rose-500"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
          </Boton>
        )}
      </div>
    </div>
  );
}
