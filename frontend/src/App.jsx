import { useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LayoutPrincipal } from './componentes/organismos/LayoutPrincipal';
import { RutaProtegida } from './componentes/organismos/RutaProtegida';
import { PaginaActividades } from './paginas/actividades/PaginaActividades';
import { PaginaAutenticacion } from './paginas/autenticacion/PaginaAutenticacion';
import { PaginaDashboard } from './paginas/dashboard/PaginaDashboard';
import { PaginaMedallas } from './paginas/medallas/PaginaMedallas';
import { PaginaProyectos } from './paginas/proyectos/PaginaProyectos';

export function App() {
  const temaOscuro = useSelector((state) => state.autenticacion.temaOscuro);

  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        theme={temaOscuro ? 'dark' : 'light'}
        richColors
        closeButton
      />
      <Routes>
        <Route path="/autenticacion" element={<PaginaAutenticacion />} />

        <Route element={<RutaProtegida />}>
          <Route element={<LayoutPrincipal />}>
            <Route path="/dashboard" element={<PaginaDashboard />} />
            <Route path="/proyectos" element={<PaginaProyectos />} />
            <Route path="/actividades" element={<PaginaActividades />} />
            <Route path="/medallas" element={<PaginaMedallas />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
