import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Proyecto } from '../../proyecto/entities/proyecto.entity';
import { RolProyecto } from '../../enums';

export { RolProyecto };

@Entity('miembros_proyecto')
export class MiembroProyecto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: RolProyecto,
    default: RolProyecto.MIEMBRO,
  })
  rol: RolProyecto;

  @Column()
  proyectoId: number;

  @Column()
  usuarioId: number;

  @CreateDateColumn()
  fechaUnion: Date;

  // Relaciones
  @ManyToOne(() => Proyecto, (proyecto) => proyecto.miembros, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'proyectoId' })
  proyecto: Proyecto;

  @ManyToOne(() => Usuario, (usuario) => usuario.membresias, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;
}
