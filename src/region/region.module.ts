import { Module } from '@nestjs/common';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionRepository } from './region.repository';
import { MapperModule } from '../mapper/mapper.module';

@Module({
  imports: [TypeOrmModule.forFeature([RegionRepository]), MapperModule],
  controllers: [RegionController],
  providers: [RegionService],
  exports: [RegionService],
})
export class RegionModule {}
