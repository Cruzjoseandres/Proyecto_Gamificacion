import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { BarraLateral } from './BarraLateral';
import { EncabezadoGamificado } from './EncabezadoGamificado';

export function LayoutPrincipal() {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F5F5F7] dark:bg-[#09090B]">
      <BarraLateral
        abiertoMovil={menuMovilAbierto}
        alCerrarMovil={() => setMenuMovilAbierto(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <EncabezadoGamificado
          alAbrirMenu={() => setMenuMovilAbierto(true)}
        />
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
