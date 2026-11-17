import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AutenticacionService } from './autenticacion.service';
import { AutenticacionController } from './autenticacion.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    UsuarioModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'clave_secreta_gamificacion_u_2026',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AutenticacionController],
  providers: [AutenticacionService, JwtAuthGuard],
  exports: [AutenticacionService, JwtAuthGuard],
})
export class AutenticacionModule {}
