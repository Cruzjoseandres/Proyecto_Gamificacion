import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { ProyectoModule } from './proyecto/proyecto.module';
import { MiembroProyectoModule } from './miembro-proyecto/miembro-proyecto.module';
import { ActividadModule } from './actividad/actividad.module';
import { RegistroActividadModule } from './registro-actividad/registro-actividad.module';
import { MedallaModule } from './medalla/medalla.module';
import { MedallaUsuarioModule } from './medalla-usuario/medalla-usuario.module';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { ReporteModule } from './reporte/reporte.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5501,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'gamificacion_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsuarioModule,
    ProyectoModule,
    MiembroProyectoModule,
    ActividadModule,
    RegistroActividadModule,
    MedallaModule,
    MedallaUsuarioModule,
    AutenticacionModule,
    ReporteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
