import { Module } from '@nestjs/common';
import { StageService } from './stage.service';
import { StageController } from './stage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StageRepository } from './stage.repository';
import { MapperService } from '../mapper/mapper.service';
import { MapperModule } from '../mapper/mapper.module';
import { Stage } from './stage.entity';
import { StageViewModel } from './stage.view-model';

@Module({
  imports: [TypeOrmModule.forFeature([StageRepository]), MapperModule],
  providers: [StageService],
  controllers: [StageController],
  exports: [StageService],
})
export class StageModule {
  constructor(private mapperService: MapperService) {
    this.mapperService.create(Stage, StageViewModel);
  }
}
