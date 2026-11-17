import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Proyecto } from '../../proyecto/entities/proyecto.entity';
import { MiembroProyecto } from '../../miembro-proyecto/entities/miembro-proyecto.entity';
import { Actividad } from '../../actividad/entities/actividad.entity';
import { RegistroActividad } from '../../registro-actividad/entities/registro-actividad.entity';
import { MedallaUsuario } from '../../medalla-usuario/entities/medalla-usuario.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  correo: string;

  @Column()
  contrasena: string;

  @Column({ nullable: true })
  nombre: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: 0 })
  experiencia: number;

  @Column({ default: 1 })
  nivel: number;

  @Column({ default: 0 })
  racha: number;

  @Column({ type: 'timestamp', nullable: true })
  ultimaFechaActiva: Date;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;

  // Relaciones
  @OneToMany(() => Proyecto, (proyecto) => proyecto.propietario)
  proyectosPropios: Proyecto[];

  @OneToMany(() => MiembroProyecto, (miembro) => miembro.usuario)
  membresias: MiembroProyecto[];

  @OneToMany(() => Actividad, (actividad) => actividad.creador)
  actividadesCreadas: Actividad[];

  @OneToMany(() => Actividad, (actividad) => actividad.asignado)
  actividadesAsignadas: Actividad[];

  @OneToMany(() => RegistroActividad, (registro) => registro.usuario)
  registrosActividades: RegistroActividad[];

  @OneToMany(() => MedallaUsuario, (medallaUsuario) => medallaUsuario.usuario)
  medallasUsuario: MedallaUsuario[];
}
