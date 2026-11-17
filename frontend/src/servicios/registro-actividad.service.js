import { clienteApi } from '../api/cliente-api';

export const registroActividadService = {
  async obtenerTodos() {
    return await clienteApi.get('/registros-actividad');
  },

  async crear(datos) {
    return await clienteApi.post('/registros-actividad', datos);
  },
};

