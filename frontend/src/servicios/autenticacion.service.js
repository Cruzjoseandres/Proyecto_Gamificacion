import { clienteApi } from '../api/cliente-api';

export const autenticacionService = {
  async registrar(datos) {
    return await clienteApi.post('/autenticacion/registro', datos);
  },

  async login(datos) {
    return await clienteApi.post('/autenticacion/login', datos);
  },

  async obtenerPerfil() {
    return await clienteApi.get('/autenticacion/perfil');
  },
};

