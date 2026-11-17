import { clienteApi } from '../api/cliente-api';

export const miembroProyectoService = {
  async obtenerTodos() {
    return await clienteApi.get('/miembros-proyecto');
  },

  async crear(datos) {
    return await clienteApi.post('/miembros-proyecto', datos);
  },

  async eliminar(id) {
    return await clienteApi.delete(`/miembros-proyecto/${id}`);
  },
};

