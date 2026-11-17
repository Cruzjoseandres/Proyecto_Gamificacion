import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Medalla } from '../../medalla/entities/medalla.entity';

@Entity('medallas_usuario')
export class MedallaUsuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuarioId: number;

  @Column()
  medallaId: number;

  @CreateDateColumn()
  fechaDesbloqueo: Date;

  // Relaciones
  @ManyToOne(() => Usuario, (usuario) => usuario.medallasUsuario, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @ManyToOne(() => Medalla, (medalla) => medalla.medallasUsuario, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'medallaId' })
  medalla: Medalla;
}
