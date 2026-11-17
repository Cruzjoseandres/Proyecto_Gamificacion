import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  obtenerPerfilThunk,
  obtenerUsuariosRankingThunk,
} from '../../store/slices/autenticacion.slice';
import { cargarCatalogoMedallasThunk } from '../../store/slices/reportes.slice';

export function useMedallas() {
  const dispatch = useDispatch();
  const { usuario, listaUsuarios } = useSelector(
    (state) => state.autenticacion,
  );
  const { catalogoMedallas, cargando } = useSelector((state) => state.reportes);

  useEffect(() => {
    dispatch(cargarCatalogoMedallasThunk());
    dispatch(obtenerPerfilThunk());
    dispatch(obtenerUsuariosRankingThunk());
  }, [dispatch]);

  const mapaDesbloqueadas = new Map(
    (usuario?.medallasUsuario || []).map((mu) => [
      mu.medallaId,
      mu.fechaDesbloqueo,
    ]),
  );

  const experiencia = usuario?.experiencia || 0;
  const nivel = usuario?.nivel || 1;
  const xpNivelActual = experiencia % 100;

  return {
    usuario,
    experiencia,
    nivel,
    xpNivelActual,
    catalogoMedallas,
    mapaDesbloqueadas,
    listaUsuarios,
    cargando,
  };
}

