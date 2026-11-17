import { clienteApi } from '../api/cliente-api';

export const reporteService = {
  async obtenerReporteGeneral(usuarioId) {
    const query = usuarioId ? `?usuarioId=${usuarioId}` : '';
    return await clienteApi.get(`/reportes/general${query}`);
  },

  async obtenerReporteProyecto(proyectoId) {
    return await clienteApi.get(`/reportes/proyecto/${proyectoId}`);
  },
};

