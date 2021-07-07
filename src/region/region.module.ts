import { Module } from '@nestjs/common';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionRepository } from './region.repository';
import { MapperModule } from '../mapper/mapper.module';
import { MapperService } from '../mapper/mapper.service';
import { Region } from './region.entity';
import { RegionViewModel } from './region.view-model';

@Module({
  imports: [TypeOrmModule.forFeature([RegionRepository]), MapperModule],
  controllers: [RegionController],
  providers: [RegionService],
  exports: [RegionService],
})
export class RegionModule {
  constructor(private mapperService: MapperService) {
    this.mapperService.create(Region, RegionViewModel);
  }
}
