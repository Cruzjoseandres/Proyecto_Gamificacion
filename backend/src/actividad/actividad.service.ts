import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Actividad } from './entities/actividad.entity';
import { CrearActividadDto } from './dto/crear-actividad.dto';
import { ActualizarActividadDto } from './dto/actualizar-actividad.dto';
import { RegistroActividad } from '../registro-actividad/entities/registro-actividad.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Medalla } from '../medalla/entities/medalla.entity';
import { MedallaUsuario } from '../medalla-usuario/entities/medalla-usuario.entity';
import {
  EstadoActividad,
  FrecuenciaActividad,
  TipoActividad,
} from '../enums';

@Injectable()
export class ActividadService {
  constructor(
    @InjectRepository(Actividad)
    private readonly actividadRepository: Repository<Actividad>,
    @InjectRepository(RegistroActividad)
    private readonly registroActividadRepository: Repository<RegistroActividad>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Medalla)
    private readonly medallaRepository: Repository<Medalla>,
    @InjectRepository(MedallaUsuario)
    private readonly medallaUsuarioRepository: Repository<MedallaUsuario>,
  ) {}

  private sanitizarUsuario(usuario?: Usuario | null) {
    if (!usuario) return usuario;
    const { contrasena: _contrasena, ...sinContrasena } = usuario;
    return sinContrasena;
  }

  private sanitizarActividad(actividad: Actividad) {
    return {
      ...actividad,
      creador: this.sanitizarUsuario(actividad.creador),
      asignado: this.sanitizarUsuario(actividad.asignado),
      registros: (actividad.registros || []).map((r) => ({
        ...r,
        usuario: this.sanitizarUsuario(r.usuario),
      })),
    };
  }

  private esMismoDia(fechaA: Date, fechaB: Date): boolean {
    const a = new Date(fechaA);
    const b = new Date(fechaB);
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  async crear(crearActividadDto: CrearActividadDto) {
    const tipo = crearActividadDto.tipo || TipoActividad.UNICA;
    const frecuencia =
      tipo === TipoActividad.UNICA
        ? FrecuenciaActividad.NINGUNA
        : crearActividadDto.frecuencia || FrecuenciaActividad.DIARIA;

    const actividad = this.actividadRepository.create({
      ...crearActividadDto,
      tipo,
      frecuencia,
    });
    const guardada = await this.actividadRepository.save(actividad);
    return await this.obtenerPorId(guardada.id);
  }

  async obtenerTodas(filtros?: {
    proyectoId?: number;
    usuarioId?: number;
    tipo?: TipoActividad;
    estado?: EstadoActividad;
  }) {
    const actividades = await this.actividadRepository.find({
      relations: {
        proyecto: true,
        creador: true,
        asignado: true,
        registros: true,
      },
      order: { fechaCreacion: 'DESC' },
    });

    const filtradas = actividades.filter((a) => {
      if (filtros?.proyectoId && a.proyectoId !== filtros.proyectoId) {
        return false;
      }
      if (
        filtros?.usuarioId &&
        a.creadorId !== filtros.usuarioId &&
        a.asignadoId !== filtros.usuarioId
      ) {
        return false;
      }
      if (filtros?.tipo && a.tipo !== filtros.tipo) {
        return false;
      }
      if (filtros?.estado && a.estado !== filtros.estado) {
        return false;
      }
      return true;
    });

    return filtradas.map((a) => this.sanitizarActividad(a));
  }

  async obtenerPorId(id: number) {
    const actividad = await this.actividadRepository.findOne({
      where: { id },
      relations: {
        proyecto: true,
        creador: true,
        asignado: true,
        registros: {
          usuario: true,
        },
      },
    });

    if (!actividad) {
      throw new NotFoundException(`Actividad #${id} no encontrada`);
    }

    return this.sanitizarActividad(actividad);
  }

  async actualizar(id: number, actualizarActividadDto: ActualizarActividadDto) {
    await this.obtenerPorId(id);
    await this.actividadRepository.update(id, actualizarActividadDto);
    return await this.obtenerPorId(id);
  }

  async eliminar(id: number) {
    await this.obtenerPorId(id);
    await this.actividadRepository.delete(id);
    return { eliminado: true, id };
  }

  async completarActividad(
    id: number,
    datos?: { usuarioId?: number; notas?: string },
  ) {
    const actividad = await this.actividadRepository.findOne({ where: { id } });
    if (!actividad) {
      throw new NotFoundException(`Actividad #${id} no encontrada`);
    }

    if (
      actividad.tipo === TipoActividad.UNICA &&
      actividad.estado === EstadoActividad.COMPLETADA
    ) {
      throw new BadRequestException('Esta actividad única ya fue completada');
    }

    const idUsuario =
      datos?.usuarioId || actividad.asignadoId || actividad.creadorId;
    const usuario = await this.usuarioRepository.findOne({
      where: { id: idUsuario },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    actividad.estado = EstadoActividad.COMPLETADA;
    await this.actividadRepository.save(actividad);

    const nuevoRegistro = this.registroActividadRepository.create({
      actividadId: actividad.id,
      usuarioId: usuario.id,
      experienciaGanada: actividad.recompensaExp,
      notas: datos?.notas || 'Actividad completada',
    });
    const registro = await this.registroActividadRepository.save(nuevoRegistro);

    usuario.experiencia += actividad.recompensaExp;
    usuario.nivel = Math.floor(usuario.experiencia / 100) + 1;

    const hoy = new Date();
    if (
      usuario.racha === 0 ||
      !usuario.ultimaFechaActiva ||
      !this.esMismoDia(usuario.ultimaFechaActiva, hoy)
    ) {
      usuario.racha += 1;
    }
    usuario.ultimaFechaActiva = hoy;

    const usuarioActualizado = await this.usuarioRepository.save(usuario);

    const medallasElegibles = await this.medallaRepository.find({
      where: {
        experienciaRequerida: LessThanOrEqual(usuarioActualizado.experiencia),
      },
    });

    const medallasActuales = await this.medallaUsuarioRepository.find({
      where: { usuarioId: usuario.id },
    });
    const idsMedallasActuales = new Set(medallasActuales.map((m) => m.medallaId));

    const nuevasMedallas: Medalla[] = [];
    for (const medalla of medallasElegibles) {
      if (!idsMedallasActuales.has(medalla.id)) {
        const nueva = this.medallaUsuarioRepository.create({
          usuarioId: usuario.id,
          medallaId: medalla.id,
        });
        await this.medallaUsuarioRepository.save(nueva);
        nuevasMedallas.push(medalla);
      }
    }

    return {
      mensaje: 'Actividad completada',
      experienciaGanada: actividad.recompensaExp,
      actividad: await this.obtenerPorId(id),
      usuario: this.sanitizarUsuario(usuarioActualizado),
      registro,
      nuevasMedallas,
    };
  }
}
