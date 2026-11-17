import { useEffect } from 'react';
import { X } from 'lucide-react';

export function ModalBase({
  abierto,
  alCerrar,
  titulo,
  subtitulo = '',
  children,
  anchoMaximo = 'max-w-xl',
}) {
  useEffect(() => {
    if (!abierto) return;

    function manejarTecla(evento) {
      if (evento.key === 'Escape') {
        alCerrar();
      }
    }

    window.addEventListener('keydown', manejarTecla);
    return () => window.removeEventListener('keydown', manejarTecla);
  }, [abierto, alCerrar]);

  if (!abierto) return null;

  return (
    <div
      className="modal-fondo-animado fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/45 p-4 backdrop-blur-sm"
      onClick={alCerrar}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`modal-panel-animado my-auto w-full ${anchoMaximo} rounded-3xl border border-black/[0.08] dark:border-white/[0.12] bg-white/95 dark:bg-[#16161A]/95 p-6 shadow-2xl backdrop-blur-2xl`}
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-black/[0.06] dark:border-white/[0.08] pb-4">
          <div>
            <h3 className="apple-heading text-lg font-semibold text-[#1D1D1F] dark:text-white">
              {titulo}
            </h3>
            {subtitulo && (
              <p className="mt-1 text-xs text-[#6E6E73] dark:text-zinc-400">
                {subtitulo}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={alCerrar}
            aria-label="Cerrar modal"
            className="btn-interactivo rounded-full bg-black/[0.05] dark:bg-white/[0.08] p-1.5 text-[#6E6E73] dark:text-zinc-300 hover:bg-black/[0.09] dark:hover:bg-white/[0.14] cursor-pointer"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
