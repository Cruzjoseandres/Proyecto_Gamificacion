import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CLAVE_TOKEN, CLAVE_USUARIO } from '../../api/cliente-api';
import { autenticacionService } from '../../servicios/autenticacion.service';
import { usuarioService } from '../../servicios/usuario.service';

const CLAVE_TEMA = 'tema_gamificacion';

function leerTemaInicial() {
  try {
    const oscuro = localStorage.getItem(CLAVE_TEMA) === 'oscuro';
    document.documentElement.classList.toggle('dark', oscuro);
    return oscuro;
  } catch {
    return false;
  }
}

function leerUsuarioGuardado() {
  try {
    const guardado = localStorage.getItem(CLAVE_USUARIO);
    return guardado ? JSON.parse(guardado) : null;
  } catch {
    return null;
  }
}

export const iniciarSesionThunk = createAsyncThunk(
  'autenticacion/iniciarSesion',
  async (credenciales, { rejectWithValue }) => {
    try {
      const respuesta = await autenticacionService.login(credenciales);
      localStorage.setItem(CLAVE_TOKEN, respuesta.token);
      localStorage.setItem(CLAVE_USUARIO, JSON.stringify(respuesta.usuario));
      return respuesta;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const registrarUsuarioThunk = createAsyncThunk(
  'autenticacion/registrar',
  async (datos, { rejectWithValue }) => {
    try {
      const respuesta = await autenticacionService.registrar(datos);
      localStorage.setItem(CLAVE_TOKEN, respuesta.token);
      localStorage.setItem(CLAVE_USUARIO, JSON.stringify(respuesta.usuario));
      return respuesta;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const obtenerPerfilThunk = createAsyncThunk(
  'autenticacion/obtenerPerfil',
  async (_, { rejectWithValue }) => {
    try {
      const usuario = await autenticacionService.obtenerPerfil();
      localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
      return usuario;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const obtenerUsuariosRankingThunk = createAsyncThunk(
  'autenticacion/obtenerUsuariosRanking',
  async (_, { rejectWithValue }) => {
    try {
      return await usuarioService.obtenerTodos();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const temaInicial = leerTemaInicial();

const autenticacionSlice = createSlice({
  name: 'autenticacion',
  initialState: {
    usuario: leerUsuarioGuardado(),
    token: localStorage.getItem(CLAVE_TOKEN) || null,
    listaUsuarios: [],
    temaOscuro: temaInicial,
    cargando: false,
    error: null,
  },
  reducers: {
    alternarTemaOscuro(state) {
      state.temaOscuro = !state.temaOscuro;
      localStorage.setItem(CLAVE_TEMA, state.temaOscuro ? 'oscuro' : 'claro');
      document.documentElement.classList.toggle('dark', state.temaOscuro);
    },
    cerrarSesion(state) {
      state.usuario = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem(CLAVE_TOKEN);
      localStorage.removeItem(CLAVE_USUARIO);
    },
    sincronizarUsuarioGamificado(state, action) {
      if (!action.payload) return;
      state.usuario = {
        ...(state.usuario || {}),
        ...action.payload,
      };
      localStorage.setItem(CLAVE_USUARIO, JSON.stringify(state.usuario));
    },
    limpiarErrorAuth(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(iniciarSesionThunk.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(iniciarSesionThunk.fulfilled, (state, action) => {
        state.cargando = false;
        state.token = action.payload.token;
        state.usuario = action.payload.usuario;
      })
      .addCase(iniciarSesionThunk.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.payload || 'No se pudo iniciar sesión';
      })
      .addCase(registrarUsuarioThunk.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(registrarUsuarioThunk.fulfilled, (state, action) => {
        state.cargando = false;
        state.token = action.payload.token;
        state.usuario = action.payload.usuario;
      })
      .addCase(registrarUsuarioThunk.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.payload || 'No se pudo registrar el usuario';
      })
      .addCase(obtenerPerfilThunk.fulfilled, (state, action) => {
        state.usuario = action.payload;
      })
      .addCase(obtenerUsuariosRankingThunk.fulfilled, (state, action) => {
        state.listaUsuarios = action.payload;
      });
  },
});

export const {
  alternarTemaOscuro,
  cerrarSesion,
  sincronizarUsuarioGamificado,
  limpiarErrorAuth,
} = autenticacionSlice.actions;

export default autenticacionSlice.reducer;
