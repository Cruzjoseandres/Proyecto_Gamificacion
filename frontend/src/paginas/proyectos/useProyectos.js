import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { COLORES_PROYECTO, RolProyecto } from '../../constantes/enums';
import { obtenerUsuariosRankingThunk } from '../../store/slices/autenticacion.slice';
import {
  cargarProyectosThunk,
  crearProyectoThunk,
  desvincularMiembroThunk,
  eliminarProyectoThunk,
  seleccionarProyecto,
  vincularMiembroThunk,
} from '../../store/slices/proyectos.slice';
import {
  cargarReporteProyectoThunk,
  limpiarReporteProyecto,
} from '../../store/slices/reportes.slice';

export function useProyectos() {
  const dispatch = useDispatch();
  const { usuario, listaUsuarios } = useSelector(
    (state) => state.autenticacion,
  );
  const { listaProyectos, proyectoSeleccionado, cargando } = useSelector(
    (state) => state.proyectos,
  );
  const { reporteProyectoActual } = useSelector((state) => state.reportes);

  // Modal de creación de proyecto
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [nombreProyecto, setNombreProyecto] = useState('');
  const [descripcionProyecto, setDescripcionProyecto] = useState('');
  const [colorProyecto, setColorProyecto] = useState(COLORES_PROYECTO[0]);
  const [guardandoProyecto, setGuardandoProyecto] = useState(false);

  // Modal de vinculación de miembros
  const [proyectoParaVincular, setProyectoParaVincular] = useState(null);
  const [usuarioIdVincular, setUsuarioIdVincular] = useState('');
  const [correoVincular, setCorreoVincular] = useState('');
  const [rolVincular, setRolVincular] = useState(RolProyecto.MIEMBRO);
  const [vinculando, setVinculando] = useState(false);

  useEffect(() => {
    if (!usuario?.id) return;
    dispatch(cargarProyectosThunk(usuario.id));
    dispatch(obtenerUsuariosRankingThunk());
  }, [dispatch, usuario?.id]);

  function alSeleccionarProyecto(proyecto) {
    if (proyectoSeleccionado?.id === proyecto.id) {
      dispatch(seleccionarProyecto(null));
      dispatch(limpiarReporteProyecto());
      return;
    }
    dispatch(seleccionarProyecto(proyecto));
    dispatch(cargarReporteProyectoThunk(proyecto.id));
  }

  async function alCrearProyecto(evento) {
    evento.preventDefault();
    if (!usuario?.id) return;
    setGuardandoProyecto(true);

    try {
      const creado = await dispatch(
        crearProyectoThunk({
          nombre: nombreProyecto,
          descripcion: descripcionProyecto,
          color: colorProyecto,
          propietarioId: usuario.id,
        }),
      ).unwrap();

      toast.success('Proyecto creado', {
        description: `"${creado.nombre}" listo para recibir actividades.`,
      });
      setNombreProyecto('');
      setDescripcionProyecto('');
      setColorProyecto(COLORES_PROYECTO[0]);
      setModalCrearAbierto(false);
      dispatch(seleccionarProyecto(creado));
      dispatch(cargarReporteProyectoThunk(creado.id));
    } catch (error) {
      toast.error(
        typeof error === 'string' ? error : 'Error al crear el proyecto',
      );
    } finally {
      setGuardandoProyecto(false);
    }
  }

  function alAbrirModalVincular(proyecto) {
    setProyectoParaVincular(proyecto);
    setUsuarioIdVincular('');
    setCorreoVincular('');
    setRolVincular(RolProyecto.MIEMBRO);
  }

  function alCerrarModalVincular() {
    setProyectoParaVincular(null);
  }

  async function alVincularMiembro(evento) {
    evento.preventDefault();
    if (!proyectoParaVincular) return;

    if (!usuarioIdVincular && !correoVincular.trim()) {
      toast.error('Selecciona un usuario o escribe su correo electrónico');
      return;
    }

    setVinculando(true);
    try {
      const datos = {
        rol: rolVincular,
      };
      if (usuarioIdVincular) {
        datos.usuarioId = Number(usuarioIdVincular);
      } else {
        datos.correo = correoVincular.trim();
      }

      await dispatch(
        vincularMiembroThunk({
          proyectoId: proyectoParaVincular.id,
          datos,
        }),
      ).unwrap();

      if (proyectoSeleccionado?.id === proyectoParaVincular.id) {
        dispatch(cargarReporteProyectoThunk(proyectoParaVincular.id));
      }

      toast.success('Miembro vinculado', {
        description: 'El usuario ahora forma parte del equipo del proyecto.',
      });
      setProyectoParaVincular(null);
    } catch (error) {
      toast.error(
        typeof error === 'string' ? error : 'No se pudo vincular al usuario',
      );
    } finally {
      setVinculando(false);
    }
  }

  async function alDesvincularMiembro(proyectoId, usuarioId) {
    try {
      await dispatch(
        desvincularMiembroThunk({ proyectoId, usuarioId }),
      ).unwrap();
      if (proyectoSeleccionado?.id === proyectoId) {
        dispatch(cargarReporteProyectoThunk(proyectoId));
      }
      toast.success('Miembro desvinculado del proyecto');
    } catch (error) {
      toast.error(
        typeof error === 'string' ? error : 'No se pudo desvincular al usuario',
      );
    }
  }

  async function alEliminarProyecto(proyectoId) {
    try {
      await dispatch(eliminarProyectoThunk(proyectoId)).unwrap();
      dispatch(limpiarReporteProyecto());
      toast.success('Proyecto eliminado');
    } catch (error) {
      toast.error(
        typeof error === 'string' ? error : 'Error al eliminar proyecto',
      );
    }
  }

  const opcionesUsuarios = listaUsuarios.map((u) => ({
    valor: String(u.id),
    etiqueta: `${u.nombre || 'Sin nombre'} (${u.correo})`,
  }));

  return {
    listaProyectos,
    proyectoSeleccionado,
    reporteProyectoActual,
    cargando,
    opcionesUsuarios,
    modalCrearAbierto,
    setModalCrearAbierto,
    nombreProyecto,
    setNombreProyecto,
    descripcionProyecto,
    setDescripcionProyecto,
    colorProyecto,
    setColorProyecto,
    guardandoProyecto,
    proyectoParaVincular,
    usuarioIdVincular,
    setUsuarioIdVincular,
    correoVincular,
    setCorreoVincular,
    rolVincular,
    setRolVincular,
    vinculando,
    alSeleccionarProyecto,
    alCrearProyecto,
    alAbrirModalVincular,
    alCerrarModalVincular,
    alVincularMiembro,
    alDesvincularMiembro,
    alEliminarProyecto,
  };
}

