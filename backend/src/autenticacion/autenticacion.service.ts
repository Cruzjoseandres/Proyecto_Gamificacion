import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuario/entities/usuario.entity';
import { LoginDto, RegistroDto } from './dto/crear-autenticacion.dto';

@Injectable()
export class AutenticacionService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  private limpiarUsuario(usuario: Usuario) {
    const { contrasena: _contrasena, ...usuarioSinContrasena } = usuario;
    return usuarioSinContrasena;
  }

  async registrar(dto: RegistroDto) {
    const existe = await this.usuarioRepository.findOne({
      where: { correo: dto.correo },
    });

    if (existe) {
      throw new BadRequestException('El correo ya está registrado');
    }

    const contrasenaHash = await bcrypt.hash(dto.contrasena, 10);

    const nuevoUsuario = this.usuarioRepository.create({
      nombre: dto.nombre,
      correo: dto.correo,
      contrasena: contrasenaHash,
      avatarUrl: dto.avatarUrl,
      nivel: 1,
      experiencia: 0,
      racha: 0,
      ultimaFechaActiva: new Date(),
    });

    const usuarioGuardado = await this.usuarioRepository.save(nuevoUsuario);

    const payload = {
      id: usuarioGuardado.id,
      correo: usuarioGuardado.correo,
      nombre: usuarioGuardado.nombre,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      usuario: this.limpiarUsuario(usuarioGuardado),
    };
  }

  async login(dto: LoginDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { correo: dto.correo },
    });

    if (!usuario) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    const contrasenaValida = await bcrypt.compare(dto.contrasena, usuario.contrasena);
    if (!contrasenaValida) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    const payload = {
      id: usuario.id,
      correo: usuario.correo,
      nombre: usuario.nombre,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      usuario: this.limpiarUsuario(usuario),
    };
  }

  async obtenerPerfil(usuarioId: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
      relations: {
        proyectosPropios: true,
        membresias: {
          proyecto: true,
        },
        medallasUsuario: {
          medalla: true,
        },
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.limpiarUsuario(usuario);
  }
}
