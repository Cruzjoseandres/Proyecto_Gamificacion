import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Actividad } from '../../actividad/entities/actividad.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('registros_actividad')
export class RegistroActividad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  actividadId: number;

  @Column()
  usuarioId: number;

  @Column({ default: 0 })
  experienciaGanada: number;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @CreateDateColumn()
  fechaCompletado: Date;

  // Relaciones
  @ManyToOne(() => Actividad, (actividad) => actividad.registros, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'actividadId' })
  actividad: Actividad;

  @ManyToOne(() => Usuario, (usuario) => usuario.registrosActividades, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;
}
