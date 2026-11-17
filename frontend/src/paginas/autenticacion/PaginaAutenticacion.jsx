import { BarChart3, CheckCircle2, Flame, Lock, Mail, Moon, Sun, User, Users } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Boton } from '../../componentes/atomos/Boton';
import { CampoTexto } from '../../componentes/atomos/CampoTexto';
import { alternarTemaOscuro } from '../../store/slices/autenticacion.slice';
import { useAutenticacion } from './useAutenticacion';

export function PaginaAutenticacion() {
  const dispatch = useDispatch();
  const temaOscuro = useSelector((state) => state.autenticacion.temaOscuro);

  const {
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
  } = useAutenticacion();

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#F5F5F7] dark:bg-[#09090B] px-4 py-10">
      <button
        type="button"
        onClick={() => dispatch(alternarTemaOscuro())}
        aria-label={temaOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        className="btn-interactivo fixed right-5 top-5 inline-flex h-9 items-center gap-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-white/80 dark:bg-white/[0.06] px-3 text-xs font-medium text-[#1D1D1F] dark:text-zinc-200 backdrop-blur-md cursor-pointer"
      >
        {temaOscuro ? (
          <>
            <Sun className="h-3.5 w-3.5 text-amber-400" strokeWidth={1.75} />
            <span>Claro</span>
          </>
        ) : (
          <>
            <Moon className="h-3.5 w-3.5 text-zinc-700" strokeWidth={1.75} />
            <span>Oscuro</span>
          </>
        )}
      </button>

      <div className="vista-animada apple-card grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl shadow-xl md:grid-cols-2">
        {/* Panel informativo izquierdo */}
        <div className="flex flex-col justify-between border-b md:border-b-0 md:border-r border-black/[0.06] dark:border-white/[0.08] bg-[#141418] p-8 text-white">
          <div>
            <div className="inline-flex items-center gap-2.5">
              <svg
                viewBox="0 0 28 28"
                className="h-7 w-7 text-white"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="1.5"
                  y="1.5"
                  width="25"
                  height="25"
                  rx="7"
                  className="stroke-white/20 fill-white/10"
                  strokeWidth="1.5"
                />
                <circle
                  cx="14"
                  cy="14"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="1.75"
                />
                <circle cx="14" cy="14" r="2.25" fill="#0A84FF" />
              </svg>
              <span className="apple-heading text-sm font-semibold tracking-tight">
                QuestFlow
              </span>
            </div>

            <h1 className="apple-heading mt-8 text-2xl font-semibold sm:text-3xl">
              Organiza proyectos y convierte cada acción en avance medible.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Registra actividades únicas o recurrentes, colabora con tu equipo y
              visualiza el progreso real mediante reportes gráficos.
            </p>
          </div>

          <div className="mt-10 space-y-3 border-t border-white/10 pt-6 text-xs text-zinc-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2
                className="h-4 w-4 shrink-0 text-[#0A84FF]"
                strokeWidth={1.75}
              />
              <span>Actividades únicas y hábitos recurrentes con XP</span>
            </div>
            <div className="flex items-center gap-2.5">
              <BarChart3
                className="h-4 w-4 shrink-0 text-emerald-400"
                strokeWidth={1.75}
              />
              <span>Reportes gráficos por proyecto, estado y acción</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Flame
                className="h-4 w-4 shrink-0 text-amber-400"
                strokeWidth={1.75}
              />
              <span>Sistema de niveles, rachas y logros desbloqueables</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Users
                className="h-4 w-4 shrink-0 text-violet-400"
                strokeWidth={1.75}
              />
              <span>Vinculación de usuarios a proyectos colaborativos</span>
            </div>
          </div>
        </div>

        {/* Formulario derecho */}
        <div className="p-8 sm:p-10">
          <div className="mb-6 flex rounded-full bg-black/[0.05] dark:bg-white/[0.07] p-1">
            <button
              type="button"
              onClick={() => cambiarModo(false)}
              className={`btn-interactivo flex-1 rounded-full py-1.5 text-xs font-semibold cursor-pointer ${
                !esRegistro
                  ? 'bg-white dark:bg-[#242429] text-[#1D1D1F] dark:text-white shadow-2xs'
                  : 'text-[#6E6E73] dark:text-zinc-400 hover:text-[#1D1D1F] dark:hover:text-white'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => cambiarModo(true)}
              className={`btn-interactivo flex-1 rounded-full py-1.5 text-xs font-semibold cursor-pointer ${
                esRegistro
                  ? 'bg-white dark:bg-[#242429] text-[#1D1D1F] dark:text-white shadow-2xs'
                  : 'text-[#6E6E73] dark:text-zinc-400 hover:text-[#1D1D1F] dark:hover:text-white'
              }`}
            >
              Crear cuenta
            </button>
          </div>

          <h2 className="apple-heading text-xl font-semibold text-[#1D1D1F] dark:text-white">
            {esRegistro ? 'Crear nueva cuenta' : 'Bienvenido de nuevo'}
          </h2>
          <p className="mt-1 text-xs text-[#6E6E73] dark:text-zinc-400">
            {esRegistro
              ? 'Comienza en Nivel 1 y acumula experiencia completando tus objetivos.'
              : 'Ingresa tus credenciales para acceder a tu espacio de trabajo.'}
          </p>

          <form onSubmit={alEnviarFormulario} className="mt-6 space-y-4">
            {esRegistro && (
              <CampoTexto
                id="auth-nombre"
                etiqueta="Nombre completo"
                type="text"
                required
                icono={<User className="h-4 w-4" strokeWidth={1.75} />}
                placeholder="Ej. Ana García"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            )}

            <CampoTexto
              id="auth-correo"
              etiqueta="Correo electrónico"
              type="email"
              required
              icono={<Mail className="h-4 w-4" strokeWidth={1.75} />}
              placeholder="nombre@universidad.edu"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />

            <CampoTexto
              id="auth-contrasena"
              etiqueta="Contraseña"
              type="password"
              required
              minLength={4}
              icono={<Lock className="h-4 w-4" strokeWidth={1.75} />}
              placeholder="••••••••"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />

            {error && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3.5 py-2.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                {error}
              </div>
            )}

            <Boton
              type="submit"
              tamano="lg"
              cargando={cargando}
              className="w-full mt-2"
            >
              {esRegistro ? 'Crear cuenta y continuar' : 'Ingresar'}
            </Boton>
          </form>
        </div>
      </div>
    </div>
  );
}
