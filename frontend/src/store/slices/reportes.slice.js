import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { medallaService } from '../../servicios/medalla.service';
import { reporteService } from '../../servicios/reporte.service';

export const cargarReporteGeneralThunk = createAsyncThunk(
  'reportes/cargarGeneral',
  async (usuarioId, { rejectWithValue }) => {
    try {
      return await reporteService.obtenerReporteGeneral(usuarioId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const cargarReporteProyectoThunk = createAsyncThunk(
  'reportes/cargarProyecto',
  async (proyectoId, { rejectWithValue }) => {
    try {
      return await reporteService.obtenerReporteProyecto(proyectoId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const cargarCatalogoMedallasThunk = createAsyncThunk(
  'reportes/cargarMedallas',
  async (_, { rejectWithValue }) => {
    try {
      return await medallaService.obtenerTodas();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const reportesSlice = createSlice({
  name: 'reportes',
  initialState: {
    reporteGeneral: null,
    reporteProyectoActual: null,
    catalogoMedallas: [],
    cargando: false,
    error: null,
  },
  reducers: {
    limpiarReporteProyecto(state) {
      state.reporteProyectoActual = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cargarReporteGeneralThunk.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(cargarReporteGeneralThunk.fulfilled, (state, action) => {
        state.cargando = false;
        state.reporteGeneral = action.payload;
      })
      .addCase(cargarReporteGeneralThunk.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.payload || 'Error al cargar reporte general';
      })
      .addCase(cargarReporteProyectoThunk.fulfilled, (state, action) => {
        state.reporteProyectoActual = action.payload;
      })
      .addCase(cargarCatalogoMedallasThunk.fulfilled, (state, action) => {
        state.catalogoMedallas = action.payload;
      });
  },
});

export const { limpiarReporteProyecto } = reportesSlice.actions;

export default reportesSlice.reducer;

