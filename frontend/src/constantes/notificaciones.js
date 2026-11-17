import { toast } from 'sonner';

export function mostrarToastRecompensa(respuesta, nivelAnterior = 1) {
  const titulo = respuesta.actividad?.titulo || 'Actividad';
  const exp = respuesta.experienciaGanada || 0;

  toast.success(`+${exp} XP ganados`, {
    description: `Cumpliste "${titulo}" correctamente.`,
  });

  const nivelNuevo = respuesta.usuario?.nivel || nivelAnterior;
  if (nivelNuevo > nivelAnterior) {
    toast.success(`Ascenso a Nivel ${nivelNuevo}`, {
      description: 'Tu constancia sigue impulsando tu progreso.',
    });
  }

  for (const medalla of respuesta.nuevasMedallas || []) {
    toast.success(`Logro desbloqueado: ${medalla.nombre}`, {
      description: medalla.descripcion,
    });
  }
}
