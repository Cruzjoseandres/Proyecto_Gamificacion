import { configureStore } from '@reduxjs/toolkit';
import autenticacionReducer from './slices/autenticacion.slice';
import proyectosReducer from './slices/proyectos.slice';
import actividadesReducer from './slices/actividades.slice';
import reportesReducer from './slices/reportes.slice';

export const store = configureStore({
  reducer: {
    autenticacion: autenticacionReducer,
    proyectos: proyectosReducer,
    actividades: actividadesReducer,
    reportes: reportesReducer,
  },
});

