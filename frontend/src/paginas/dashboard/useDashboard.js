import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { EstadoActividad, TipoActividad } from '../../constantes/enums';
import { mostrarToastRecompensa } from '../../constantes/notificaciones';
import {
  cargarActividadesThunk,
  completarActividadThunk,
} from '../../store/slices/actividades.slice';
import { obtenerPerfilThunk } from '../../store/slices/autenticacion.slice';
import { cargarProyectosThunk } from '../../store/slices/proyectos.slice';
import { cargarReporteGeneralThunk } from '../../store/slices/reportes.slice';

export function useDashboard() {
  const dispatch = useDispatch();
  const { usuario } = useSelector((state) => state.autenticacion);
  const { reporteGeneral, cargando: cargandoReporte } = useSelector(
    (state) => state.reportes,
  );
  const { listaActividades } = useSelector((state) => state.actividades);
  const [idCompletando, setIdCompletando] = useState(null);

  useEffect(() => {
    if (!usuario?.id) return;
    dispatch(obtenerPerfilThunk());
    dispatch(cargarReporteGeneralThunk(usuario.id));
    dispatch(cargarProyectosThunk(usuario.id));
    dispatch(cargarActividadesThunk({ usuarioId: usuario.id }));
  }, [dispatch, usuario?.id]);

  function alRecargarDashboard() {
    if (!usuario?.id) return;
    dispatch(cargarReporteGeneralThunk(usuario.id));
    dispatch(cargarProyectosThunk(usuario.id));
    dispatch(cargarActividadesThunk({ usuarioId: usuario.id }));
  }

  async function alCompletarRapido(actividad) {
    if (!usuario?.id) return;
    const nivelAnterior = usuario.nivel || 1;
    setIdCompletando(actividad.id);

    try {
      const respuesta = await dispatch(
        completarActividadThunk({
          id: actividad.id,
          usuarioId: usuario.id,
          notas: 'Completada desde el Dashboard',
        }),
      ).unwrap();

      mostrarToastRecompensa(respuesta, nivelAnterior);
    } catch (error) {
      toast.error(
        typeof error === 'string'
          ? error
          : 'No se pudo completar la actividad',
      );
    } finally {
      setIdCompletando(null);
    }
  }

  const actividadesRapidas = listaActividades
    .filter(
      (act) =>
        act.tipo === TipoActividad.RECURRENTE ||
        act.estado !== EstadoActividad.COMPLETADA,
    )
    .slice(0, 6);

  return {
    usuario,
    reporteGeneral,
    cargandoReporte,
    actividadesRapidas,
    idCompletando,
    alCompletarRapido,
    alRecargarDashboard,
  };
}

