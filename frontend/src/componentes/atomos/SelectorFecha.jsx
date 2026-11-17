import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const DIAS_SEMANA = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

function formatearISO(fecha) {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  const d = String(fecha.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parsearISO(valor) {
  if (!valor) return null;
  const partes = String(valor).split('-');
  if (partes.length !== 3) return null;
  return new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
}

export function SelectorFecha({
  etiqueta,
  id,
  value = '',
  onChange,
  placeholder = 'Seleccionar fecha',
  className = '',
}) {
  const fechaSeleccionada = parsearISO(value);
  const [hoyISO] = useState(() => formatearISO(new Date()));

  const [abierto, setAbierto] = useState(false);
  const [mesVista, setMesVista] = useState(
    () => (parsearISO(value) || new Date()).getMonth(),
  );
  const [anioVista, setAnioVista] = useState(
    () => (parsearISO(value) || new Date()).getFullYear(),
  );
  const contenedorRef = useRef(null);

  useEffect(() => {
    if (!abierto) return;

    function alHacerClicFuera(evento) {
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(evento.target)
      ) {
        setAbierto(false);
      }
    }

    function alPresionarTecla(evento) {
      if (evento.key === 'Escape') {
        setAbierto(false);
      }
    }

    document.addEventListener('mousedown', alHacerClicFuera);
    window.addEventListener('keydown', alPresionarTecla);
    return () => {
      document.removeEventListener('mousedown', alHacerClicFuera);
      window.removeEventListener('keydown', alPresionarTecla);
    };
  }, [abierto]);

  function emitirValor(nuevoValor) {
    setAbierto(false);
    if (onChange) {
      onChange({ target: { value: nuevoValor } });
    }
  }

  function seleccionarFecha(fecha) {
    setMesVista(fecha.getMonth());
    setAnioVista(fecha.getFullYear());
    emitirValor(formatearISO(fecha));
  }

  function seleccionarConOffsetDias(dias) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    seleccionarFecha(fecha);
  }

  function cambiarMes(delta) {
    let nuevoMes = mesVista + delta;
    let nuevoAnio = anioVista;
    if (nuevoMes < 0) {
      nuevoMes = 11;
      nuevoAnio -= 1;
    } else if (nuevoMes > 11) {
      nuevoMes = 0;
      nuevoAnio += 1;
    }
    setMesVista(nuevoMes);
    setAnioVista(nuevoAnio);
  }

  const primerDiaMes = new Date(anioVista, mesVista, 1);
  const indiceInicioSemana = (primerDiaMes.getDay() + 6) % 7;
  const totalDiasMes = new Date(anioVista, mesVista + 1, 0).getDate();

  const celdas = [];
  for (let i = 0; i < indiceInicioSemana; i += 1) {
    celdas.push(null);
  }
  for (let dia = 1; dia <= totalDiasMes; dia += 1) {
    celdas.push(new Date(anioVista, mesVista, dia));
  }

  const textoMostrado = fechaSeleccionada
    ? fechaSeleccionada.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : placeholder;

  return (
    <div ref={contenedorRef} className={`relative flex flex-col gap-1.5 ${className}`}>
      {etiqueta && (
        <label
          htmlFor={id}
          className="apple-overline text-[11px] font-semibold uppercase text-[#6E6E73] dark:text-zinc-400"
        >
          {etiqueta}
        </label>
      )}

      <div className="relative flex items-center">
        <button
          id={id}
          type="button"
          onClick={() => setAbierto((prev) => !prev)}
          className={`btn-interactivo flex h-10 w-full items-center justify-between gap-2 rounded-xl border bg-white dark:bg-[#1C1C22] px-3.5 text-sm font-medium cursor-pointer focus:outline-none focus:ring-3 focus:ring-[#0071E3]/20 ${
            abierto
              ? 'border-[#0071E3] ring-3 ring-[#0071E3]/15'
              : 'border-black/[0.11] dark:border-white/[0.12] hover:border-black/20 dark:hover:border-white/20'
          }`}
        >
          <span className="flex items-center gap-2 truncate">
            <Calendar
              className="h-4 w-4 shrink-0 text-[#6E6E73] dark:text-zinc-400"
              strokeWidth={1.75}
            />
            <span
              className={`tabular-nums truncate ${
                fechaSeleccionada
                  ? 'text-[#1D1D1F] dark:text-zinc-100'
                  : 'text-[#6E6E73] dark:text-zinc-400'
              }`}
            >
              {textoMostrado}
            </span>
          </span>
        </button>

        {value && (
          <button
            type="button"
            aria-label="Limpiar fecha"
            onClick={() => emitirValor('')}
            className="btn-interactivo absolute right-2.5 rounded-full p-1 text-[#6E6E73] dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        )}
      </div>

      {abierto && (
        <div className="popover-animado absolute right-0 top-full z-50 mt-1.5 w-72 origin-top rounded-2xl border border-black/[0.08] dark:border-white/[0.12] bg-white/95 dark:bg-[#1C1C22]/95 p-3.5 shadow-2xl backdrop-blur-2xl">
          {/* Encabezado mes/año */}
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => cambiarMes(-1)}
              aria-label="Mes anterior"
              className="btn-interactivo rounded-lg p-1.5 text-[#6E6E73] dark:text-zinc-300 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <span className="text-xs font-semibold text-[#1D1D1F] dark:text-white">
              {MESES[mesVista]} {anioVista}
            </span>
            <button
              type="button"
              onClick={() => cambiarMes(1)}
              aria-label="Mes siguiente"
              className="btn-interactivo rounded-lg p-1.5 text-[#6E6E73] dark:text-zinc-300 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>

          {/* Atajos rápidos */}
          <div className="mb-3 grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => seleccionarConOffsetDias(0)}
              className="btn-interactivo rounded-lg bg-black/[0.04] dark:bg-white/[0.07] py-1 text-[11px] font-medium text-[#1D1D1F] dark:text-zinc-200 hover:bg-black/[0.08] dark:hover:bg-white/[0.12] cursor-pointer"
            >
              Hoy
            </button>
            <button
              type="button"
              onClick={() => seleccionarConOffsetDias(1)}
              className="btn-interactivo rounded-lg bg-black/[0.04] dark:bg-white/[0.07] py-1 text-[11px] font-medium text-[#1D1D1F] dark:text-zinc-200 hover:bg-black/[0.08] dark:hover:bg-white/[0.12] cursor-pointer"
            >
              Mañana
            </button>
            <button
              type="button"
              onClick={() => seleccionarConOffsetDias(7)}
              className="btn-interactivo rounded-lg bg-black/[0.04] dark:bg-white/[0.07] py-1 text-[11px] font-medium text-[#1D1D1F] dark:text-zinc-200 hover:bg-black/[0.08] dark:hover:bg-white/[0.12] cursor-pointer"
            >
              +7 días
            </button>
          </div>

          {/* Días de la semana */}
          <div className="mb-1 grid grid-cols-7 text-center text-[10px] font-semibold uppercase text-[#6E6E73] dark:text-zinc-400">
            {DIAS_SEMANA.map((d) => (
              <span key={d} className="py-1">
                {d}
              </span>
            ))}
          </div>

          {/* Cuadrícula de días */}
          <div className="grid grid-cols-7 gap-1">
            {celdas.map((fecha, indice) => {
              if (!fecha) {
                return <span key={`vacio-${indice}`} className="h-8" />;
              }

              const iso = formatearISO(fecha);
              const esSeleccionado = value === iso;
              const esHoy = hoyISO === iso;

              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => seleccionarFecha(fecha)}
                  className={`btn-interactivo tabular-nums flex h-8 items-center justify-center rounded-lg text-xs font-medium cursor-pointer ${
                    esSeleccionado
                      ? 'bg-[#0071E3] text-white font-semibold'
                      : esHoy
                        ? 'border border-[#0071E3]/40 text-[#0071E3] dark:text-[#409CFF] hover:bg-[#0071E3]/10'
                        : 'text-[#1D1D1F] dark:text-zinc-200 hover:bg-black/[0.05] dark:hover:bg-white/[0.08]'
                  }`}
                >
                  {fecha.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
