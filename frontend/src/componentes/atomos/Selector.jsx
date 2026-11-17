import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function Selector({
  etiqueta,
  id,
  opciones = [],
  placeholder = 'Seleccionar...',
  value = '',
  onChange,
  tamano = 'md',
  icono = null,
  ubicacionMenu = 'abajo',
  className = '',
}) {
  const [abierto, setAbierto] = useState(false);
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

  const listaOpciones = placeholder
    ? [{ valor: '', etiqueta: placeholder }, ...opciones]
    : opciones;

  const opcionActual = listaOpciones.find(
    (op) => String(op.valor) === String(value ?? ''),
  );

  function seleccionar(nuevoValor) {
    setAbierto(false);
    if (onChange) {
      onChange({ target: { value: nuevoValor } });
    }
  }

  const esPequeno = tamano === 'sm';

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

      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={abierto}
        onClick={() => setAbierto((prev) => !prev)}
        className={`btn-interactivo flex w-full items-center justify-between gap-2 border text-left cursor-pointer focus:outline-none focus:ring-3 focus:ring-[#0071E3]/20 ${
          esPequeno
            ? 'h-8 rounded-lg border-black/[0.08] dark:border-white/[0.1] bg-black/[0.03] dark:bg-white/[0.06] px-2.5 text-xs font-medium'
            : 'h-10 rounded-xl border-black/[0.11] dark:border-white/[0.12] bg-white dark:bg-[#1C1C22] px-3.5 text-sm font-medium'
        } ${
          abierto
            ? 'border-[#0071E3] ring-3 ring-[#0071E3]/15'
            : 'hover:border-black/20 dark:hover:border-white/20'
        }`}
      >
        <span className="flex min-w-0 items-center gap-2 truncate">
          {icono && (
            <span className="shrink-0 text-[#6E6E73] dark:text-zinc-400">
              {icono}
            </span>
          )}
          <span
            className={`truncate ${
              opcionActual && opcionActual.valor !== ''
                ? 'text-[#1D1D1F] dark:text-zinc-100'
                : 'text-[#6E6E73] dark:text-zinc-400'
            }`}
          >
            {opcionActual ? opcionActual.etiqueta : placeholder}
          </span>
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#6E6E73] dark:text-zinc-400 transition-transform duration-150 ${
            abierto ? 'rotate-180 text-[#0071E3]' : ''
          }`}
          strokeWidth={1.75}
        />
      </button>

      {abierto && (
        <div
          role="listbox"
          className={`popover-animado absolute z-50 min-w-full w-max max-w-xs sm:max-w-sm rounded-2xl border border-black/[0.08] dark:border-white/[0.12] bg-white/95 dark:bg-[#1C1C22]/95 p-1.5 shadow-2xl backdrop-blur-2xl max-h-60 overflow-y-auto ${
            ubicacionMenu === 'arriba'
              ? 'bottom-full mb-1.5 origin-bottom'
              : 'top-full mt-1.5 origin-top'
          }`}
        >
          {listaOpciones.map((opcion) => {
            const estaSeleccionada =
              String(opcion.valor) === String(value ?? '');
            return (
              <button
                key={opcion.valor}
                type="button"
                role="option"
                aria-selected={estaSeleccionada}
                onClick={() => seleccionar(opcion.valor)}
                className={`btn-interactivo flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-xs font-medium cursor-pointer ${
                  estaSeleccionada
                    ? 'bg-[#0071E3] text-white'
                    : 'text-[#1D1D1F] dark:text-zinc-200 hover:bg-black/[0.05] dark:hover:bg-white/[0.08]'
                }`}
              >
                <span className="truncate">{opcion.etiqueta}</span>
                {estaSeleccionada && (
                  <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
