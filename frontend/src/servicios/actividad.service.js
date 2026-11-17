import { clienteApi } from '../api/cliente-api';

export const actividadService = {
  async obtenerTodas(filtros = {}) {
    const params = new URLSearchParams();
    if (filtros.proyectoId) params.append('proyectoId', filtros.proyectoId);
    if (filtros.usuarioId) params.append('usuarioId', filtros.usuarioId);
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.estado) params.append('estado', filtros.estado);

    const query = params.toString();
    return await clienteApi.get(`/actividades${query ? `?${query}` : ''}`);
  },

  async obtenerPorId(id) {
    return await clienteApi.get(`/actividades/${id}`);
  },

  async crear(datos) {
    return await clienteApi.post('/actividades', datos);
  },

  async actualizar(id, datos) {
    return await clienteApi.patch(`/actividades/${id}`, datos);
  },

  async eliminar(id) {
    return await clienteApi.delete(`/actividades/${id}`);
  },

  async completar(id, datos) {
    return await clienteApi.post(`/actividades/${id}/completar`, datos);
  },
};

