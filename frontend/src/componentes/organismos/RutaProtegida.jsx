import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export function RutaProtegida() {
  const { usuario, token } = useSelector((state) => state.autenticacion);

  if (!usuario || !token) {
    return <Navigate to="/autenticacion" replace />;
  }

  return <Outlet />;
}

