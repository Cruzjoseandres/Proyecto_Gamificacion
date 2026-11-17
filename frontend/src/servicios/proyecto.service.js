import { clienteApi } from '../api/cliente-api';

export const proyectoService = {
  async obtenerTodos(usuarioId) {
    const query = usuarioId ? `?usuarioId=${usuarioId}` : '';
    return await clienteApi.get(`/proyectos${query}`);
  },

  async obtenerPorId(id) {
    return await clienteApi.get(`/proyectos/${id}`);
  },

  async crear(datos) {
    return await clienteApi.post('/proyectos', datos);
  },

  async actualizar(id, datos) {
    return await clienteApi.patch(`/proyectos/${id}`, datos);
  },

  async eliminar(id) {
    return await clienteApi.delete(`/proyectos/${id}`);
  },

  async vincularUsuario(proyectoId, datos) {
    return await clienteApi.post(`/proyectos/${proyectoId}/vincular`, datos);
  },

  async desvincularUsuario(proyectoId, usuarioId) {
    return await clienteApi.delete(`/proyectos/${proyectoId}/miembros/${usuarioId}`);
  },
};

