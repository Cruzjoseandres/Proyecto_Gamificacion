import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedallaUsuario } from './entities/medalla-usuario.entity';
import { CrearMedallaUsuarioDto } from './dto/crear-medalla-usuario.dto';
import { ActualizarMedallaUsuarioDto } from './dto/actualizar-medalla-usuario.dto';

@Injectable()
export class MedallaUsuarioService {
  constructor(
    @InjectRepository(MedallaUsuario)
    private readonly medallaUsuarioRepository: Repository<MedallaUsuario>,
  ) {}

  async crear(crearMedallaUsuarioDto: CrearMedallaUsuarioDto) {
    const medallaUsuario = this.medallaUsuarioRepository.create(
      crearMedallaUsuarioDto,
    );
    return await this.medallaUsuarioRepository.save(medallaUsuario);
  }

  async obtenerTodas() {
    return await this.medallaUsuarioRepository.find({
      relations: {
        usuario: true,
        medalla: true,
      },
    });
  }

  async obtenerPorId(id: number) {
    const medallaUsuario = await this.medallaUsuarioRepository.findOne({
      where: { id },
      relations: {
        usuario: true,
        medalla: true,
      },
    });
    if (!medallaUsuario) {
      throw new NotFoundException(`Medalla de usuario #${id} no encontrada`);
    }
    return medallaUsuario;
  }

  async actualizar(
    id: number,
    actualizarMedallaUsuarioDto: ActualizarMedallaUsuarioDto,
  ) {
    await this.obtenerPorId(id);
    await this.medallaUsuarioRepository.update(id, actualizarMedallaUsuarioDto);
    return await this.obtenerPorId(id);
  }

  async eliminar(id: number) {
    await this.obtenerPorId(id);
    await this.medallaUsuarioRepository.delete(id);
    return { eliminado: true, id };
  }
}
