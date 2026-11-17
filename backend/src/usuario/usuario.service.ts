import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  private limpiarUsuario(usuario: Usuario) {
    const { contrasena: _contrasena, ...usuarioSinContrasena } = usuario;
    return usuarioSinContrasena;
  }

  async crear(crearUsuarioDto: CrearUsuarioDto) {
    const existe = await this.usuarioRepository.findOne({
      where: { correo: crearUsuarioDto.correo },
    });
    if (existe) {
      throw new BadRequestException('El correo ya está registrado');
    }

    let contrasena = crearUsuarioDto.contrasena;
    if (contrasena && !contrasena.startsWith('$2b$')) {
      contrasena = await bcrypt.hash(contrasena, 10);
    }

    const usuario = this.usuarioRepository.create({
      ...crearUsuarioDto,
      contrasena,
    });
    const guardado = await this.usuarioRepository.save(usuario);
    return this.limpiarUsuario(guardado);
  }

  async obtenerTodos() {
    const usuarios = await this.usuarioRepository.find({
      order: { experiencia: 'DESC' },
      relations: {
        medallasUsuario: {
          medalla: true,
        },
      },
    });
    return usuarios.map((u) => this.limpiarUsuario(u));
  }

  async obtenerPorId(id: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: {
        proyectosPropios: true,
        membresias: {
          proyecto: true,
        },
        actividadesAsignadas: true,
        medallasUsuario: {
          medalla: true,
        },
      },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario #${id} no encontrado`);
    }

    return this.limpiarUsuario(usuario);
  }

  async actualizar(id: number, actualizarUsuarioDto: ActualizarUsuarioDto) {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario #${id} no encontrado`);
    }

    const datosActualizar = { ...actualizarUsuarioDto };
    if (datosActualizar.contrasena && !datosActualizar.contrasena.startsWith('$2b$')) {
      datosActualizar.contrasena = await bcrypt.hash(datosActualizar.contrasena, 10);
    }

    await this.usuarioRepository.update(id, datosActualizar);
    return await this.obtenerPorId(id);
  }

  async eliminar(id: number) {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario #${id} no encontrado`);
    }
    await this.usuarioRepository.delete(id);
    return { eliminado: true, id };
  }
}
