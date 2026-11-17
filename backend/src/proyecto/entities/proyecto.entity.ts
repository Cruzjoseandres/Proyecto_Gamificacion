import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { MiembroProyecto } from '../../miembro-proyecto/entities/miembro-proyecto.entity';
import { Actividad } from '../../actividad/entities/actividad.entity';
import { EstadoProyecto } from '../../enums';

export { EstadoProyecto };

@Entity('proyectos')
export class Proyecto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ default: '#3B82F6' })
  color: string;

  @Column({
    type: 'enum',
    enum: EstadoProyecto,
    default: EstadoProyecto.ACTIVO,
  })
  estado: EstadoProyecto;

  @Column()
  propietarioId: number;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;

  // Relaciones
  @ManyToOne(() => Usuario, (usuario) => usuario.proyectosPropios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'propietarioId' })
  propietario: Usuario;

  @OneToMany(() => MiembroProyecto, (miembro) => miembro.proyecto)
  miembros: MiembroProyecto[];

  @OneToMany(() => Actividad, (actividad) => actividad.proyecto)
  actividades: Actividad[];
}
