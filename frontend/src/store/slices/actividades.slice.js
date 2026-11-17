import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { actividadService } from '../../servicios/actividad.service';
import {
  obtenerPerfilThunk,
  sincronizarUsuarioGamificado,
} from './autenticacion.slice';
import { cargarProyectosThunk } from './proyectos.slice';
import { cargarReporteGeneralThunk } from './reportes.slice';

export const cargarActividadesThunk = createAsyncThunk(
  'actividades/cargarTodas',
  async (filtros = {}, { rejectWithValue }) => {
    try {
      return await actividadService.obtenerTodas(filtros);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const crearActividadThunk = createAsyncThunk(
  'actividades/crear',
  async (datos, { dispatch, rejectWithValue }) => {
    try {
      const nueva = await actividadService.crear(datos);
      dispatch(cargarProyectosThunk(datos.creadorId));
      dispatch(cargarReporteGeneralThunk(datos.creadorId));
      return nueva;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const actualizarActividadThunk = createAsyncThunk(
  'actividades/actualizar',
  async ({ id, datos, usuarioId }, { dispatch, rejectWithValue }) => {
    try {
      const actualizada = await actividadService.actualizar(id, datos);
      if (usuarioId) {
        dispatch(cargarProyectosThunk(usuarioId));
        dispatch(cargarReporteGeneralThunk(usuarioId));
      }
      return actualizada;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const eliminarActividadThunk = createAsyncThunk(
  'actividades/eliminar',
  async ({ id, usuarioId }, { dispatch, rejectWithValue }) => {
    try {
      await actividadService.eliminar(id);
      if (usuarioId) {
        dispatch(cargarProyectosThunk(usuarioId));
        dispatch(cargarReporteGeneralThunk(usuarioId));
      }
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const completarActividadThunk = createAsyncThunk(
  'actividades/completar',
  async ({ id, usuarioId, notas }, { dispatch, rejectWithValue }) => {
    try {
      const respuesta = await actividadService.completar(id, {
        usuarioId,
        notas,
      });

      dispatch(sincronizarUsuarioGamificado(respuesta.usuario));
      if (respuesta.nuevasMedallas && respuesta.nuevasMedallas.length > 0) {
        dispatch(obtenerPerfilThunk());
      }
      dispatch(cargarReporteGeneralThunk(usuarioId));
      dispatch(cargarProyectosThunk(usuarioId));

      return respuesta;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const actividadesSlice = createSlice({
  name: 'actividades',
  initialState: {
    listaActividades: [],
    filtros: {
      proyectoId: '',
      tipo: '',
      estado: '',
    },
    ultimaRecompensa: null,
    cargando: false,
    error: null,
  },
  reducers: {
    establecerFiltrosActividades(state, action) {
      state.filtros = {
        ...state.filtros,
        ...action.payload,
      };
    },
    limpiarUltimaRecompensa(state) {
      state.ultimaRecompensa = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cargarActividadesThunk.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(cargarActividadesThunk.fulfilled, (state, action) => {
        state.cargando = false;
        state.listaActividades = action.payload;
      })
      .addCase(cargarActividadesThunk.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.payload || 'Error al cargar actividades';
      })
      .addCase(crearActividadThunk.fulfilled, (state, action) => {
        state.listaActividades.unshift(action.payload);
      })
      .addCase(actualizarActividadThunk.fulfilled, (state, action) => {
        const indice = state.listaActividades.findIndex(
          (a) => a.id === action.payload.id,
        );
        if (indice !== -1) {
          state.listaActividades[indice] = action.payload;
        }
      })
      .addCase(eliminarActividadThunk.fulfilled, (state, action) => {
        state.listaActividades = state.listaActividades.filter(
          (a) => a.id !== action.payload,
        );
      })
      .addCase(completarActividadThunk.fulfilled, (state, action) => {
        const actividadActualizada = action.payload.actividad;
        const indice = state.listaActividades.findIndex(
          (a) => a.id === actividadActualizada.id,
        );
        if (indice !== -1) {
          state.listaActividades[indice] = actividadActualizada;
        }
        state.ultimaRecompensa = {
          experienciaGanada: action.payload.experienciaGanada,
          nuevasMedallas: action.payload.nuevasMedallas || [],
          nivel: action.payload.usuario?.nivel,
        };
      });
  },
});

export const {
  establecerFiltrosActividades,
  limpiarUltimaRecompensa,
} = actividadesSlice.actions;

export default actividadesSlice.reducer;

