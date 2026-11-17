import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedallaService } from './medalla.service';
import { MedallaController } from './medalla.controller';
import { Medalla } from './entities/medalla.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Medalla])],
  controllers: [MedallaController],
  providers: [MedallaService],
  exports: [MedallaService, TypeOrmModule],
})
export class MedallaModule {}
