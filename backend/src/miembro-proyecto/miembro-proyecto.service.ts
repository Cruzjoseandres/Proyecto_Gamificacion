import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MiembroProyecto } from './entities/miembro-proyecto.entity';
import { CrearMiembroProyectoDto } from './dto/crear-miembro-proyecto.dto';
import { ActualizarMiembroProyectoDto } from './dto/actualizar-miembro-proyecto.dto';

@Injectable()
export class MiembroProyectoService {
  constructor(
    @InjectRepository(MiembroProyecto)
    private readonly miembroProyectoRepository: Repository<MiembroProyecto>,
  ) {}

  async crear(crearMiembroProyectoDto: CrearMiembroProyectoDto) {
    const miembro = this.miembroProyectoRepository.create(crearMiembroProyectoDto);
    return await this.miembroProyectoRepository.save(miembro);
  }

  async obtenerTodos() {
    return await this.miembroProyectoRepository.find({
      relations: {
        proyecto: true,
        usuario: true,
      },
    });
  }

  async obtenerPorId(id: number) {
    const miembro = await this.miembroProyectoRepository.findOne({
      where: { id },
      relations: {
        proyecto: true,
        usuario: true,
      },
    });
    if (!miembro) {
      throw new NotFoundException(`Miembro de proyecto #${id} no encontrado`);
    }
    return miembro;
  }

  async actualizar(
    id: number,
    actualizarMiembroProyectoDto: ActualizarMiembroProyectoDto,
  ) {
    await this.obtenerPorId(id);
    await this.miembroProyectoRepository.update(id, actualizarMiembroProyectoDto);
    return await this.obtenerPorId(id);
  }

  async eliminar(id: number) {
    await this.obtenerPorId(id);
    await this.miembroProyectoRepository.delete(id);
    return { eliminado: true, id };
  }
}
