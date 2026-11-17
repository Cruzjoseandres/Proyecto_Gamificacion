import { clienteApi } from '../api/cliente-api';

export const medallaService = {
  async obtenerTodas() {
    return await clienteApi.get('/medallas');
  },

  async obtenerMedallasUsuario() {
    return await clienteApi.get('/medallas-usuario');
  },

  async otorgarMedalla(datos) {
    return await clienteApi.post('/medallas-usuario', datos);
  },
};

