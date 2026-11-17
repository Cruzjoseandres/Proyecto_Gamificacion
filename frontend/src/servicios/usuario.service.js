import { clienteApi } from '../api/cliente-api';

export const usuarioService = {
  async obtenerTodos() {
    return await clienteApi.get('/usuarios');
  },

  async obtenerPorId(id) {
    return await clienteApi.get(`/usuarios/${id}`);
  },

  async crear(datos) {
    return await clienteApi.post('/usuarios', datos);
  },

  async actualizar(id, datos) {
    return await clienteApi.patch(`/usuarios/${id}`, datos);
  },

  async eliminar(id) {
    return await clienteApi.delete(`/usuarios/${id}`);
  },
};

