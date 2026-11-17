import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { proyectoService } from '../../servicios/proyecto.service';

export const cargarProyectosThunk = createAsyncThunk(
  'proyectos/cargarTodos',
  async (usuarioId, { rejectWithValue }) => {
    try {
      return await proyectoService.obtenerTodos(usuarioId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const obtenerProyectoDetalleThunk = createAsyncThunk(
  'proyectos/obtenerDetalle',
  async (id, { rejectWithValue }) => {
    try {
      return await proyectoService.obtenerPorId(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const crearProyectoThunk = createAsyncThunk(
  'proyectos/crear',
  async (datos, { rejectWithValue }) => {
    try {
      return await proyectoService.crear(datos);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const actualizarProyectoThunk = createAsyncThunk(
  'proyectos/actualizar',
  async ({ id, datos }, { rejectWithValue }) => {
    try {
      return await proyectoService.actualizar(id, datos);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const eliminarProyectoThunk = createAsyncThunk(
  'proyectos/eliminar',
  async (id, { rejectWithValue }) => {
    try {
      await proyectoService.eliminar(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const vincularMiembroThunk = createAsyncThunk(
  'proyectos/vincularMiembro',
  async ({ proyectoId, datos }, { rejectWithValue }) => {
    try {
      return await proyectoService.vincularUsuario(proyectoId, datos);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const desvincularMiembroThunk = createAsyncThunk(
  'proyectos/desvincularMiembro',
  async ({ proyectoId, usuarioId }, { rejectWithValue }) => {
    try {
      return await proyectoService.desvincularUsuario(proyectoId, usuarioId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

function reemplazarProyecto(state, proyectoActualizado) {
  const indice = state.listaProyectos.findIndex(
    (p) => p.id === proyectoActualizado.id,
  );
  if (indice !== -1) {
    state.listaProyectos[indice] = proyectoActualizado;
  }
  if (state.proyectoSeleccionado?.id === proyectoActualizado.id) {
    state.proyectoSeleccionado = proyectoActualizado;
  }
}

const proyectosSlice = createSlice({
  name: 'proyectos',
  initialState: {
    listaProyectos: [],
    proyectoSeleccionado: null,
    cargando: false,
    error: null,
  },
  reducers: {
    seleccionarProyecto(state, action) {
      state.proyectoSeleccionado = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cargarProyectosThunk.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(cargarProyectosThunk.fulfilled, (state, action) => {
        state.cargando = false;
        state.listaProyectos = action.payload;
        if (state.proyectoSeleccionado) {
          const actualizado = action.payload.find(
            (p) => p.id === state.proyectoSeleccionado.id,
          );
          if (actualizado) {
            state.proyectoSeleccionado = actualizado;
          }
        }
      })
      .addCase(cargarProyectosThunk.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.payload || 'Error al cargar proyectos';
      })
      .addCase(obtenerProyectoDetalleThunk.fulfilled, (state, action) => {
        state.proyectoSeleccionado = action.payload;
      })
      .addCase(crearProyectoThunk.fulfilled, (state, action) => {
        state.listaProyectos.unshift(action.payload);
      })
      .addCase(actualizarProyectoThunk.fulfilled, (state, action) => {
        reemplazarProyecto(state, action.payload);
      })
      .addCase(eliminarProyectoThunk.fulfilled, (state, action) => {
        state.listaProyectos = state.listaProyectos.filter(
          (p) => p.id !== action.payload,
        );
        if (state.proyectoSeleccionado?.id === action.payload) {
          state.proyectoSeleccionado = null;
        }
      })
      .addCase(vincularMiembroThunk.fulfilled, (state, action) => {
        reemplazarProyecto(state, action.payload);
      })
      .addCase(desvincularMiembroThunk.fulfilled, (state, action) => {
        reemplazarProyecto(state, action.payload);
      });
  },
});

export const { seleccionarProyecto } = proyectosSlice.actions;

export default proyectosSlice.reducer;

