import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medalla } from './entities/medalla.entity';
import { CrearMedallaDto } from './dto/crear-medalla.dto';
import { ActualizarMedallaDto } from './dto/actualizar-medalla.dto';

@Injectable()
export class MedallaService implements OnModuleInit {
  constructor(
    @InjectRepository(Medalla)
    private readonly medallaRepository: Repository<Medalla>,
  ) {}

  async onModuleInit() {
    try {
      const total = await this.medallaRepository.count();
      if (total === 0) {
        const medallasBase: CrearMedallaDto[] = [
          {
            codigo: 'PRIMER_PASO',
            nombre: 'Primer Paso',
            descripcion: 'Completar tu primera actividad',
            icono: '🎯',
            experienciaRequerida: 50,
          },
          {
            codigo: 'CONSTANCIA_100',
            nombre: 'En Racha',
            descripcion: 'Alcanzar 100 puntos de experiencia',
            icono: '🔥',
            experienciaRequerida: 100,
          },
          {
            codigo: 'EXPERTO_300',
            nombre: 'Experto del Equipo',
            descripcion: 'Alcanzar 300 puntos de experiencia',
            icono: '⚡',
            experienciaRequerida: 300,
          },
          {
            codigo: 'MAESTRO_500',
            nombre: 'Maestro de Productividad',
            descripcion: 'Alcanzar 500 puntos de experiencia',
            icono: '🏆',
            experienciaRequerida: 500,
          },
        ];

        await this.medallaRepository.save(
          medallasBase.map((m) => this.medallaRepository.create(m)),
        );
      }
    } catch (error) {
      console.error('Error al sembrar medallas base:', error);
    }
  }

  async crear(crearMedallaDto: CrearMedallaDto) {
    const medalla = this.medallaRepository.create(crearMedallaDto);
    return await this.medallaRepository.save(medalla);
  }

  async obtenerTodas() {
    return await this.medallaRepository.find({
      order: { experienciaRequerida: 'ASC' },
    });
  }

  async obtenerPorId(id: number) {
    const medalla = await this.medallaRepository.findOne({ where: { id } });
    if (!medalla) {
      throw new NotFoundException(`Medalla #${id} no encontrada`);
    }
    return medalla;
  }

  async actualizar(id: number, actualizarMedallaDto: ActualizarMedallaDto) {
    await this.obtenerPorId(id);
    await this.medallaRepository.update(id, actualizarMedallaDto);
    return await this.obtenerPorId(id);
  }

  async eliminar(id: number) {
    await this.obtenerPorId(id);
    await this.medallaRepository.delete(id);
    return { eliminado: true, id };
  }
}
