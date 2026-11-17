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
import { Proyecto } from '../../proyecto/entities/proyecto.entity';
import { RegistroActividad } from '../../registro-actividad/entities/registro-actividad.entity';
import {
  TipoActividad,
  FrecuenciaActividad,
  EstadoActividad,
} from '../../enums';

export { TipoActividad, FrecuenciaActividad, EstadoActividad };

@Entity('actividades')
export class Actividad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: TipoActividad,
    default: TipoActividad.UNICA,
  })
  tipo: TipoActividad;

  @Column({
    type: 'enum',
    enum: FrecuenciaActividad,
    default: FrecuenciaActividad.NINGUNA,
  })
  frecuencia: FrecuenciaActividad;

  @Column({ default: 50 })
  recompensaExp: number;

  @Column({
    type: 'enum',
    enum: EstadoActividad,
    default: EstadoActividad.PENDIENTE,
  })
  estado: EstadoActividad;

  @Column({ type: 'timestamp', nullable: true })
  fechaLimite: Date;

  @Column({ nullable: true })
  proyectoId: number;

  @Column()
  creadorId: number;

  @Column({ nullable: true })
  asignadoId: number;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;

  // Relaciones
  @ManyToOne(() => Proyecto, (proyecto) => proyecto.actividades, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'proyectoId' })
  proyecto: Proyecto;

  @ManyToOne(() => Usuario, (usuario) => usuario.actividadesCreadas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creadorId' })
  creador: Usuario;

  @ManyToOne(() => Usuario, (usuario) => usuario.actividadesAsignadas, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'asignadoId' })
  asignado: Usuario;

  @OneToMany(() => RegistroActividad, (registro) => registro.actividad)
  registros: RegistroActividad[];
}
