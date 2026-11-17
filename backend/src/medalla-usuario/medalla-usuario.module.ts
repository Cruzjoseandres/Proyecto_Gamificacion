import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedallaUsuarioService } from './medalla-usuario.service';
import { MedallaUsuarioController } from './medalla-usuario.controller';
import { MedallaUsuario } from './entities/medalla-usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MedallaUsuario])],
  controllers: [MedallaUsuarioController],
  providers: [MedallaUsuarioService],
  exports: [MedallaUsuarioService, TypeOrmModule],
})
export class MedallaUsuarioModule {}
