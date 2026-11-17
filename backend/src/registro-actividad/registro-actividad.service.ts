import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistroActividad } from './entities/registro-actividad.entity';
import { CrearRegistroActividadDto } from './dto/crear-registro-actividad.dto';
import { ActualizarRegistroActividadDto } from './dto/actualizar-registro-actividad.dto';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class RegistroActividadService {
  constructor(
    @InjectRepository(RegistroActividad)
    private readonly registroActividadRepository: Repository<RegistroActividad>,
  ) {}

  private sanitizarUsuario(usuario?: Usuario | null) {
    if (!usuario) return usuario;
    const { contrasena: _contrasena, ...sinContrasena } = usuario;
    return sinContrasena;
  }

  async crear(crearRegistroActividadDto: CrearRegistroActividadDto) {
    const registro = this.registroActividadRepository.create(
      crearRegistroActividadDto,
    );
    return await this.registroActividadRepository.save(registro);
  }

  async obtenerTodos() {
    const registros = await this.registroActividadRepository.find({
      relations: {
        actividad: true,
        usuario: true,
      },
      order: { fechaCompletado: 'DESC' },
    });

    return registros.map((r) => ({
      ...r,
      usuario: this.sanitizarUsuario(r.usuario),
    }));
  }

  async obtenerPorId(id: number) {
    const registro = await this.registroActividadRepository.findOne({
      where: { id },
      relations: {
        actividad: true,
        usuario: true,
      },
    });
    if (!registro) {
      throw new NotFoundException(`Registro de actividad #${id} no encontrado`);
    }
    return {
      ...registro,
      usuario: this.sanitizarUsuario(registro.usuario),
    };
  }

  async actualizar(
    id: number,
    actualizarRegistroActividadDto: ActualizarRegistroActividadDto,
  ) {
    await this.obtenerPorId(id);
    await this.registroActividadRepository.update(
      id,
      actualizarRegistroActividadDto,
    );
    return await this.obtenerPorId(id);
  }

  async eliminar(id: number) {
    await this.obtenerPorId(id);
    await this.registroActividadRepository.delete(id);
    return { eliminado: true, id };
  }
}
