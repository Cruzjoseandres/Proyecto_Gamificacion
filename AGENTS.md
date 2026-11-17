# Reglas y Convenciones del Proyecto (`Proyecto_Gamificacion`)

Este proyecto es una plataforma web gamificada para gestionar y completar actividades (únicas y recurrentes) de forma individual o en equipo, con seguimiento visual de progreso mediante gráficos.

## Convenciones Generales
- **Idioma del código de dominio**: Los nombres de carpetas, archivos, entidades, atributos, enums, métodos, rutas de API y textos de interfaz deben estar en **español**.
- **Extensiones estándar**: Mantener las extensiones técnicas propias de cada framework (`.entity.ts`, `.service.ts`, `.controller.ts`, `.module.ts`, `.dto.ts`, `.enum.ts`, `.guard.ts`, `.slice.ts`, `.tsx`, etc.).
- **Simplicidad y claridad**: Evitar patrones complejos o sobre-ingeniería; priorizar código directo, legible y mantenible.

## Convenciones del Backend (`backend/`)
- **Stack**: NestJS + TypeORM + PostgreSQL (`localhost:5501`, base de datos `gamificacion_db`, usuario `postgres`).
- **Funciones asíncronas**: Todos los servicios y controladores deben usar funciones `async / await` directas con TypeORM.
- **Enums**: Centralizados en `backend/src/enums/` (un archivo `.enum.ts` por cada enum más `index.ts`).
- **Autenticación**: JWT (`JwtAuthGuard`) con contraseñas cifradas mediante `bcrypt`.
- **Formato / Lint**: Mantener desactivadas en ESLint/Prettier las reglas estrictas de espacios en blanco y saltos de línea (`prettier/prettier`, `no-trailing-spaces`, `no-multiple-empty-lines`, `no-empty`).

## Convenciones del Frontend (`frontend/`)
- **Stack principal**: React + **Redux Toolkit** (obligatorio para el manejo de estado global: autenticación, proyectos, actividades y métricas/reportes) + librería de gráficos para visualizar el progreso de cada acción y proyecto + Sonner para notificaciones.
- **Diseño e Interacción (Skills de Emil Kowalski en `.agents/skills/`)**:
  Al diseñar, construir o revisar componentes e interfaces del frontend, consultar y aplicar las skills locales en `.agents/skills/`:
  - `emil-design-eng`: Pulido visual, micro-interacciones y detalles de UI.
  - `animate` / `choreograph` / `review-animations`: Curvas de animación (`ease-out` para entradas y transiciones), animar solo propiedades compuestas (`transform`, `opacity`), evitar `transition: all`, respetar `prefers-reduced-motion`.
  - `apple-design` / `gestures`: Fluidez física, consistencia espacial, feedback táctil inmediato.
  - `ask-sonner`: Notificaciones toast limpias y oportunas al completar actividades, subir de nivel o desbloquear medallas.
  - `pick-ui-library` / `prototype` / `break-ui` / `mobile-native`: Selección de componentes accesibles, pruebas con datos extremos (nombres largos, listas vacías, números grandes) y buena respuesta en móvil.
- **Detalles obligatorios de UI**:
  - Estados de respuesta al clic/presión en botones interactivos (`:active` con `transform: scale(0.97)`).
  - Usar `font-variant-numeric: tabular-nums` en contadores dinámicos (XP, niveles, rachas, porcentajes y métricas en gráficos).
  - Modales y popovers deben aparecer con escala y opacidad (`scale(0.95)` -> `scale(1)`), nunca desde `scale(0)`.

