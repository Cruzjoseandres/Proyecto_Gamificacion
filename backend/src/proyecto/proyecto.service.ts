import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { CrearProyectoDto } from './dto/crear-proyecto.dto';
import { ActualizarProyectoDto } from './dto/actualizar-proyecto.dto';
import { MiembroProyecto } from '../miembro-proyecto/entities/miembro-proyecto.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { EstadoActividad, RolProyecto } from '../enums';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
    @InjectRepository(MiembroProyecto)
    private readonly miembroProyectoRepository: Repository<MiembroProyecto>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  private sanitizarUsuario(usuario?: Usuario | null) {
    if (!usuario) return usuario;
    const { contrasena: _contrasena, ...sinContrasena } = usuario;
    return sinContrasena;
  }

  private formatearProyectoConAvance(proyecto: Proyecto) {
    const actividades = proyecto.actividades || [];
    const totalActividades = actividades.length;
    const actividadesCompletadas = actividades.filter(
      (act) => act.estado === EstadoActividad.COMPLETADA,
    ).length;
    const porcentajeAvance =
      totalActividades > 0
        ? Math.round((actividadesCompletadas / totalActividades) * 100)
        : 0;

    return {
      ...proyecto,
      propietario: this.sanitizarUsuario(proyecto.propietario),
      miembros: (proyecto.miembros || []).map((m) => ({
        ...m,
        usuario: this.sanitizarUsuario(m.usuario),
      })),
      actividades: actividades.map((a) => ({
        ...a,
        creador: this.sanitizarUsuario(a.creador),
        asignado: this.sanitizarUsuario(a.asignado),
      })),
      totalActividades,
      actividadesCompletadas,
      porcentajeAvance,
    };
  }

  async crear(crearProyectoDto: CrearProyectoDto) {
    const propietario = await this.usuarioRepository.findOne({
      where: { id: crearProyectoDto.propietarioId },
    });
    if (!propietario) {
      throw new NotFoundException('Propietario no encontrado');
    }

    const nuevoProyecto = this.proyectoRepository.create(crearProyectoDto);
    const proyectoGuardado = await this.proyectoRepository.save(nuevoProyecto);

    const miembroPropietario = this.miembroProyectoRepository.create({
      proyectoId: proyectoGuardado.id,
      usuarioId: crearProyectoDto.propietarioId,
      rol: RolProyecto.PROPIETARIO,
    });
    await this.miembroProyectoRepository.save(miembroPropietario);

    return await this.obtenerPorId(proyectoGuardado.id);
  }

  async obtenerTodos(usuarioId?: number) {
    const proyectos = await this.proyectoRepository.find({
      relations: {
        propietario: true,
        miembros: {
          usuario: true,
        },
        actividades: {
          asignado: true,
          creador: true,
          registros: true,
        },
      },
      order: { fechaCreacion: 'DESC' },
    });

    const filtrados = usuarioId
      ? proyectos.filter(
          (p) =>
            p.propietarioId === usuarioId ||
            (p.miembros || []).some((m) => m.usuarioId === usuarioId),
        )
      : proyectos;

    return filtrados.map((p) => this.formatearProyectoConAvance(p));
  }

  async obtenerPorId(id: number) {
    const proyecto = await this.proyectoRepository.findOne({
      where: { id },
      relations: {
        propietario: true,
        miembros: {
          usuario: true,
        },
        actividades: {
          asignado: true,
          creador: true,
          registros: true,
        },
      },
    });

    if (!proyecto) {
      throw new NotFoundException(`Proyecto #${id} no encontrado`);
    }

    return this.formatearProyectoConAvance(proyecto);
  }

  async actualizar(id: number, actualizarProyectoDto: ActualizarProyectoDto) {
    const proyecto = await this.proyectoRepository.findOne({ where: { id } });
    if (!proyecto) {
      throw new NotFoundException(`Proyecto #${id} no encontrado`);
    }

    await this.proyectoRepository.update(id, actualizarProyectoDto);
    return await this.obtenerPorId(id);
  }

  async eliminar(id: number) {
    const proyecto = await this.proyectoRepository.findOne({ where: { id } });
    if (!proyecto) {
      throw new NotFoundException(`Proyecto #${id} no encontrado`);
    }

    await this.proyectoRepository.delete(id);
    return { eliminado: true, id };
  }

  async vincularUsuario(
    proyectoId: number,
    datos: { usuarioId?: number; correo?: string; rol?: RolProyecto },
  ) {
    const proyecto = await this.proyectoRepository.findOne({
      where: { id: proyectoId },
    });
    if (!proyecto) {
      throw new NotFoundException(`Proyecto #${proyectoId} no encontrado`);
    }

    let usuario: Usuario | null = null;
    if (datos.usuarioId) {
      usuario = await this.usuarioRepository.findOne({
        where: { id: datos.usuarioId },
      });
    } else if (datos.correo) {
      usuario = await this.usuarioRepository.findOne({
        where: { correo: datos.correo },
      });
    }

    if (!usuario) {
      throw new NotFoundException('No se encontró el usuario a vincular');
    }

    const yaVinculado = await this.miembroProyectoRepository.findOne({
      where: { proyectoId, usuarioId: usuario.id },
    });

    if (yaVinculado) {
      throw new BadRequestException('El usuario ya pertenece al proyecto');
    }

    const miembro = this.miembroProyectoRepository.create({
      proyectoId,
      usuarioId: usuario.id,
      rol: datos.rol || RolProyecto.MIEMBRO,
    });
    await this.miembroProyectoRepository.save(miembro);

    return await this.obtenerPorId(proyectoId);
  }

  async desvincularUsuario(proyectoId: number, usuarioId: number) {
    const miembro = await this.miembroProyectoRepository.findOne({
      where: { proyectoId, usuarioId },
    });
    if (!miembro) {
      throw new NotFoundException(
        'El usuario no pertenece a este proyecto',
      );
    }

    await this.miembroProyectoRepository.delete(miembro.id);
    return await this.obtenerPorId(proyectoId);
  }
}
