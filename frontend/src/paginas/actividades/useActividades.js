import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { FrecuenciaActividad, TipoActividad } from '../../constantes/enums';
import { mostrarToastRecompensa } from '../../constantes/notificaciones';
import {
  actualizarActividadThunk,
  cargarActividadesThunk,
  completarActividadThunk,
  crearActividadThunk,
  eliminarActividadThunk,
  establecerFiltrosActividades,
} from '../../store/slices/actividades.slice';
import { obtenerUsuariosRankingThunk } from '../../store/slices/autenticacion.slice';
import { cargarProyectosThunk } from '../../store/slices/proyectos.slice';

export function useActividades() {
  const dispatch = useDispatch();
  const { usuario, listaUsuarios } = useSelector(
    (state) => state.autenticacion,
  );
  const { listaProyectos } = useSelector((state) => state.proyectos);
  const { listaActividades, filtros, cargando } = useSelector(
    (state) => state.actividades,
  );

  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [idCompletando, setIdCompletando] = useState(null);

  // Campos del formulario de actividad
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState(TipoActividad.UNICA);
  const [frecuencia, setFrecuencia] = useState(FrecuenciaActividad.DIARIA);
  const [recompensaExp, setRecompensaExp] = useState('50');
  const [proyectoId, setProyectoId] = useState('');
  const [asignadoId, setAsignadoId] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');

  useEffect(() => {
    if (!usuario?.id) return;
    dispatch(cargarProyectosThunk(usuario.id));
    dispatch(obtenerUsuariosRankingThunk());
  }, [dispatch, usuario?.id]);

  useEffect(() => {
    if (!usuario?.id) return;
    dispatch(
      cargarActividadesThunk({
        usuarioId: usuario.id,
        ...filtros,
      }),
    );
  }, [dispatch, usuario?.id, filtros]);

  function alCambiarFiltro(campo, valor) {
    dispatch(establecerFiltrosActividades({ [campo]: valor }));
  }

  function reiniciarFormulario() {
    setTitulo('');
    setDescripcion('');
    setTipo(TipoActividad.UNICA);
    setFrecuencia(FrecuenciaActividad.DIARIA);
    setRecompensaExp('50');
    setProyectoId('');
    setAsignadoId('');
    setFechaLimite('');
  }

  async function alCrearActividad(evento) {
    evento.preventDefault();
    if (!usuario?.id) return;
    setGuardando(true);

    try {
      const payload = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || undefined,
        tipo,
        frecuencia:
          tipo === TipoActividad.RECURRENTE
            ? frecuencia
            : FrecuenciaActividad.NINGUNA,
        recompensaExp: Math.max(10, Number(recompensaExp) || 50),
        creadorId: usuario.id,
      };

      if (proyectoId) payload.proyectoId = Number(proyectoId);
      if (asignadoId) payload.asignadoId = Number(asignadoId);
      if (tipo === TipoActividad.UNICA && fechaLimite) {
        payload.fechaLimite = new Date(fechaLimite).toISOString();
      }

      const creada = await dispatch(crearActividadThunk(payload)).unwrap();
      toast.success('Actividad registrada', {
        description: `"${creada.titulo}" (+${creada.recompensaExp} XP).`,
      });
      reiniciarFormulario();
      setModalCrearAbierto(false);
    } catch (error) {
      toast.error(
        typeof error === 'string' ? error : 'Error al registrar actividad',
      );
    } finally {
      setGuardando(false);
    }
  }

  async function alCompletarActividad(actividad) {
    if (!usuario?.id) return;
    const nivelAnterior = usuario.nivel || 1;
    setIdCompletando(actividad.id);

    try {
      const respuesta = await dispatch(
        completarActividadThunk({
          id: actividad.id,
          usuarioId: usuario.id,
          notas:
            actividad.tipo === TipoActividad.RECURRENTE
              ? 'Ciclo recurrente completado'
              : 'Actividad completada',
        }),
      ).unwrap();

      mostrarToastRecompensa(respuesta, nivelAnterior);
    } catch (error) {
      toast.error(
        typeof error === 'string' ? error : 'No se pudo completar la actividad',
      );
    } finally {
      setIdCompletando(null);
    }
  }

  async function alCambiarEstado(id, nuevoEstado) {
    if (!usuario?.id) return;
    try {
      await dispatch(
        actualizarActividadThunk({
          id,
          datos: { estado: nuevoEstado },
          usuarioId: usuario.id,
        }),
      ).unwrap();
      toast.success('Estado actualizado');
    } catch (error) {
      toast.error(
        typeof error === 'string' ? error : 'Error al cambiar el estado',
      );
    }
  }

  async function alEliminarActividad(id) {
    if (!usuario?.id) return;
    try {
      await dispatch(
        eliminarActividadThunk({ id, usuarioId: usuario.id }),
      ).unwrap();
      toast.success('Actividad eliminada');
    } catch (error) {
      toast.error(
        typeof error === 'string' ? error : 'Error al eliminar actividad',
      );
    }
  }

  const opcionesProyectos = listaProyectos.map((p) => ({
    valor: String(p.id),
    etiqueta: p.nombre,
  }));

  const opcionesUsuarios = listaUsuarios.map((u) => ({
    valor: String(u.id),
    etiqueta: u.nombre ? `${u.nombre} (${u.correo})` : u.correo,
  }));

  return {
    listaActividades,
    filtros,
    cargando,
    opcionesProyectos,
    opcionesUsuarios,
    modalCrearAbierto,
    setModalCrearAbierto,
    guardando,
    idCompletando,
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    tipo,
    setTipo,
    frecuencia,
    setFrecuencia,
    recompensaExp,
    setRecompensaExp,
    proyectoId,
    setProyectoId,
    asignadoId,
    setAsignadoId,
    fechaLimite,
    setFechaLimite,
    alCambiarFiltro,
    alCrearActividad,
    alCompletarActividad,
    alCambiarEstado,
    alEliminarActividad,
  };
}

