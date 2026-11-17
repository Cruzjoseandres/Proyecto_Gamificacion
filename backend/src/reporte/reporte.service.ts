import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from '../proyecto/entities/proyecto.entity';
import { Actividad } from '../actividad/entities/actividad.entity';
import { RegistroActividad } from '../registro-actividad/entities/registro-actividad.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { MiembroProyecto } from '../miembro-proyecto/entities/miembro-proyecto.entity';
import { EstadoActividad, TipoActividad } from '../enums';

@Injectable()
export class ReporteService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
    @InjectRepository(Actividad)
    private readonly actividadRepository: Repository<Actividad>,
    @InjectRepository(RegistroActividad)
    private readonly registroActividadRepository: Repository<RegistroActividad>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(MiembroProyecto)
    private readonly miembroProyectoRepository: Repository<MiembroProyecto>,
  ) {}

  private calcularPorcentajeActividad(estado: EstadoActividad): number {
    if (estado === EstadoActividad.COMPLETADA) return 100;
    if (estado === EstadoActividad.EN_PROGRESO) return 50;
    return 0;
  }

  private agruparHistorialPorFecha(registros: RegistroActividad[]) {
    const mapa = new Map<
      string,
      { fecha: string; actividadesCompletadas: number; experienciaGanada: number }
    >();

    for (const reg of registros) {
      const fechaObj = new Date(reg.fechaCompletado);
      const fecha = fechaObj.toISOString().split('T')[0];
      const actual = mapa.get(fecha) || {
        fecha,
        actividadesCompletadas: 0,
        experienciaGanada: 0,
      };
      actual.actividadesCompletadas += 1;
      actual.experienciaGanada += reg.experienciaGanada;
      mapa.set(fecha, actual);
    }

    return Array.from(mapa.values()).sort((a, b) =>
      a.fecha.localeCompare(b.fecha),
    );
  }

  async obtenerReporteGeneral(usuarioId?: number) {
    const todosProyectos = await this.proyectoRepository.find({
      relations: {
        miembros: true,
        actividades: true,
      },
    });

    const proyectos = usuarioId
      ? todosProyectos.filter(
          (p) =>
            p.propietarioId === usuarioId ||
            (p.miembros || []).some((m) => m.usuarioId === usuarioId),
        )
      : todosProyectos;

    const proyectoIds = new Set(proyectos.map((p) => p.id));

    const todasActividades = await this.actividadRepository.find({
      relations: {
        proyecto: true,
        registros: true,
      },
    });

    const actividades = usuarioId
      ? todasActividades.filter(
          (a) =>
            a.creadorId === usuarioId ||
            a.asignadoId === usuarioId ||
            (a.proyectoId !== null && proyectoIds.has(a.proyectoId)),
        )
      : todasActividades;

    const todosRegistros = await this.registroActividadRepository.find({
      order: { fechaCompletado: 'ASC' },
    });

    const registros = usuarioId
      ? todosRegistros.filter((r) => r.usuarioId === usuarioId)
      : todosRegistros;

    const actividadesCompletadas = actividades.filter(
      (a) => a.estado === EstadoActividad.COMPLETADA,
    ).length;
    const actividadesEnProgreso = actividades.filter(
      (a) => a.estado === EstadoActividad.EN_PROGRESO,
    ).length;
    const actividadesPendientes = actividades.filter(
      (a) => a.estado === EstadoActividad.PENDIENTE,
    ).length;
    const actividadesCanceladas = actividades.filter(
      (a) => a.estado === EstadoActividad.CANCELADA,
    ).length;

    const totalActividades = actividades.length;
    const porcentajeCumplimientoGlobal =
      totalActividades > 0
        ? Math.round((actividadesCompletadas / totalActividades) * 100)
        : 0;

    let experienciaTotal = registros.reduce(
      (sum, reg) => sum + reg.experienciaGanada,
      0,
    );
    if (usuarioId) {
      const usuario = await this.usuarioRepository.findOne({
        where: { id: usuarioId },
      });
      if (usuario) {
        experienciaTotal = usuario.experiencia;
      }
    }

    const avancePorProyecto = proyectos.map((p) => {
      const acts = p.actividades || [];
      const total = acts.length;
      const completadas = acts.filter(
        (a) => a.estado === EstadoActividad.COMPLETADA,
      ).length;
      const pendientes = acts.filter(
        (a) => a.estado === EstadoActividad.PENDIENTE,
      ).length;
      const enProgreso = acts.filter(
        (a) => a.estado === EstadoActividad.EN_PROGRESO,
      ).length;
      const porcentajeAvance =
        total > 0 ? Math.round((completadas / total) * 100) : 0;

      return {
        proyectoId: p.id,
        nombre: p.nombre,
        color: p.color,
        estado: p.estado,
        totalActividades: total,
        completadas,
        pendientes,
        enProgreso,
        porcentajeAvance,
      };
    });

    const actividadesPorEstado = {
      pendientes: actividadesPendientes,
      enProgreso: actividadesEnProgreso,
      completadas: actividadesCompletadas,
      canceladas: actividadesCanceladas,
    };

    const actividadesPorTipo = {
      unicas: actividades.filter((a) => a.tipo === TipoActividad.UNICA).length,
      recurrentes: actividades.filter(
        (a) => a.tipo === TipoActividad.RECURRENTE,
      ).length,
    };

    const progresoPorAccion = actividades.map((a) => {
      const regs = (a.registros || []).filter((r) =>
        usuarioId ? r.usuarioId === usuarioId : true,
      );
      const vecesCompletada = regs.length;
      const experienciaGenerada = regs.reduce(
        (sum, r) => sum + r.experienciaGanada,
        0,
      );

      return {
        id: a.id,
        titulo: a.titulo,
        tipo: a.tipo,
        frecuencia: a.frecuencia,
        estado: a.estado,
        proyectoNombre: a.proyecto ? a.proyecto.nombre : 'Personal',
        colorProyecto: a.proyecto ? a.proyecto.color : '#64748B',
        recompensaExp: a.recompensaExp,
        vecesCompletada,
        experienciaGenerada,
        porcentajeAvance: this.calcularPorcentajeActividad(a.estado),
      };
    });

    const historialPorFecha = this.agruparHistorialPorFecha(registros);

    return {
      resumen: {
        totalProyectos: proyectos.length,
        totalActividades,
        actividadesCompletadas,
        actividadesEnProgreso,
        actividadesPendientes,
        porcentajeCumplimientoGlobal,
        experienciaTotal,
      },
      avancePorProyecto,
      actividadesPorEstado,
      actividadesPorTipo,
      progresoPorAccion,
      historialPorFecha,
    };
  }

  async obtenerReporteProyecto(proyectoId: number) {
    const proyecto = await this.proyectoRepository.findOne({
      where: { id: proyectoId },
      relations: {
        miembros: {
          usuario: true,
        },
        actividades: {
          registros: true,
        },
      },
    });

    if (!proyecto) {
      throw new NotFoundException(`Proyecto #${proyectoId} no encontrado`);
    }

    const actividades = proyecto.actividades || [];
    const totalActividades = actividades.length;
    const completadas = actividades.filter(
      (a) => a.estado === EstadoActividad.COMPLETADA,
    ).length;
    const pendientes = actividades.filter(
      (a) => a.estado === EstadoActividad.PENDIENTE,
    ).length;
    const enProgreso = actividades.filter(
      (a) => a.estado === EstadoActividad.EN_PROGRESO,
    ).length;
    const canceladas = actividades.filter(
      (a) => a.estado === EstadoActividad.CANCELADA,
    ).length;

    const registrosProyecto = actividades.flatMap((a) => a.registros || []);

    const miembros =
      proyecto.miembros && proyecto.miembros.length > 0
        ? proyecto.miembros
        : await this.miembroProyectoRepository.find({
            where: { proyectoId },
            relations: { usuario: true },
          });

    const rendimientoMiembros = miembros.map((m) => {
      const registrosUsuario = registrosProyecto.filter(
        (r) => r.usuarioId === m.usuarioId,
      );
      return {
        usuarioId: m.usuarioId,
        nombre: m.usuario?.nombre || null,
        correo: m.usuario?.correo || null,
        rol: m.rol,
        actividadesCompletadas: registrosUsuario.length,
        experienciaAportada: registrosUsuario.reduce(
          (sum, r) => sum + r.experienciaGanada,
          0,
        ),
      };
    });

    const progresoPorAccion = actividades.map((a) => ({
      id: a.id,
      titulo: a.titulo,
      tipo: a.tipo,
      frecuencia: a.frecuencia,
      estado: a.estado,
      recompensaExp: a.recompensaExp,
      vecesCompletada: (a.registros || []).length,
      experienciaGenerada: (a.registros || []).reduce(
        (sum, r) => sum + r.experienciaGanada,
        0,
      ),
      porcentajeAvance: this.calcularPorcentajeActividad(a.estado),
    }));

    return {
      proyecto: {
        id: proyecto.id,
        nombre: proyecto.nombre,
        descripcion: proyecto.descripcion,
        color: proyecto.color,
        estado: proyecto.estado,
        totalActividades,
        completadas,
        pendientes,
        enProgreso,
        canceladas,
        porcentajeAvance:
          totalActividades > 0
            ? Math.round((completadas / totalActividades) * 100)
            : 0,
      },
      actividadesPorEstado: {
        pendientes,
        enProgreso,
        completadas,
        canceladas,
      },
      actividadesPorTipo: {
        unicas: actividades.filter((a) => a.tipo === TipoActividad.UNICA).length,
        recurrentes: actividades.filter(
          (a) => a.tipo === TipoActividad.RECURRENTE,
        ).length,
      },
      progresoPorAccion,
      rendimientoMiembros,
      historialPorFecha: this.agruparHistorialPorFecha(registrosProyecto),
    };
  }
}

