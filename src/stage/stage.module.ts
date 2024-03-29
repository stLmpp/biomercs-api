import { forwardRef, Module } from '@nestjs/common';
import { StageService } from './stage.service';
import { StageController } from './stage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StageRepository } from './stage.repository';
import { MapperModule } from '../mapper/mapper.module';
import { PlayerModule } from '../player/player.module';
import { EnvironmentModule } from '../environment/environment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StageRepository]),
    MapperModule,
    forwardRef(() => PlayerModule),
    EnvironmentModule,
  ],
  providers: [StageService],
  controllers: [StageController],
  exports: [StageService],
})
export class StageModule {}
