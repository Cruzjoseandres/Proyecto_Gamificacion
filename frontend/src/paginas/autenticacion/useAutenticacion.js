import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  iniciarSesionThunk,
  limpiarErrorAuth,
  registrarUsuarioThunk,
} from '../../store/slices/autenticacion.slice';

export function useAutenticacion() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { usuario, token, cargando, error } = useSelector(
    (state) => state.autenticacion,
  );

  const [esRegistro, setEsRegistro] = useState(false);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  useEffect(() => {
    if (usuario && token) {
      navigate('/dashboard', { replace: true });
    }
  }, [usuario, token, navigate]);

  function cambiarModo(nuevoModoRegistro) {
    setEsRegistro(nuevoModoRegistro);
    dispatch(limpiarErrorAuth());
  }

  async function alEnviarFormulario(evento) {
    evento.preventDefault();

    try {
      if (esRegistro) {
        await dispatch(
          registrarUsuarioThunk({ nombre, correo, contrasena }),
        ).unwrap();
        toast.success('¡Cuenta creada!', {
          description: 'Bienvenido a tu tablero gamificado.',
        });
      } else {
        await dispatch(iniciarSesionThunk({ correo, contrasena })).unwrap();
        toast.success('Sesión iniciada', {
          description: 'Tus proyectos y puntos están listos.',
        });
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Error de autenticación');
    }
  }

  return {
    esRegistro,
    nombre,
    setNombre,
    correo,
    setCorreo,
    contrasena,
    setContrasena,
    cargando,
    error,
    cambiarModo,
    alEnviarFormulario,
  };
}

