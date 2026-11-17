const URL_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const CLAVE_TOKEN = 'token_gamificacion';
export const CLAVE_USUARIO = 'usuario_gamificacion';

async function peticion(ruta, opciones = {}) {
  const token = localStorage.getItem(CLAVE_TOKEN);

  const cabeceras = {
    'Content-Type': 'application/json',
    ...opciones.headers,
  };

  if (token) {
    cabeceras.Authorization = `Bearer ${token}`;
  }

  const respuesta = await fetch(`${URL_BASE}${ruta}`, {
    ...opciones,
    headers: cabeceras,
  });

  const texto = await respuesta.text();
  let datos = null;
  if (texto) {
    try {
      datos = JSON.parse(texto);
    } catch {
      datos = { message: texto };
    }
  }

  if (!respuesta.ok) {
    const mensajeError = Array.isArray(datos?.message)
      ? datos.message.join(', ')
      : datos?.message || 'Error en la petición al servidor';
    throw new Error(mensajeError);
  }

  return datos;
}

export const clienteApi = {
  get: (ruta) => peticion(ruta, { method: 'GET' }),
  post: (ruta, cuerpo) =>
    peticion(ruta, {
      method: 'POST',
      body: JSON.stringify(cuerpo),
    }),
  patch: (ruta, cuerpo) =>
    peticion(ruta, {
      method: 'PATCH',
      body: JSON.stringify(cuerpo),
    }),
  delete: (ruta) => peticion(ruta, { method: 'DELETE' }),
};

