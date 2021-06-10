import { forwardRef, Module } from '@nestjs/common';
import { StageService } from './stage.service';
import { StageController } from './stage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StageRepository } from './stage.repository';
import { MapperService } from '../mapper/mapper.service';
import { MapperModule } from '../mapper/mapper.module';
import { Stage } from './stage.entity';
import { StageViewModel } from './stage.view-model';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [TypeOrmModule.forFeature([StageRepository]), MapperModule, forwardRef(() => PlayerModule)],
  providers: [StageService],
  controllers: [StageController],
  exports: [StageService],
})
export class StageModule {
  constructor(private mapperService: MapperService) {
    this.mapperService.create(Stage, StageViewModel);
  }
}
