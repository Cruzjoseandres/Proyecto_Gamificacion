import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MedallaUsuario } from '../../medalla-usuario/entities/medalla-usuario.entity';

@Entity('medallas')
export class Medalla {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  codigo: string;

  @Column()
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column()
  icono: string;

  @Column({ default: 0 })
  experienciaRequerida: number;

  @CreateDateColumn()
  fechaCreacion: Date;

  // Relaciones
  @OneToMany(() => MedallaUsuario, (medallaUsuario) => medallaUsuario.medalla)
  medallasUsuario: MedallaUsuario[];
}
