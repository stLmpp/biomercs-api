import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepository } from './category.repository';
import { SubCategoryModule } from '../sub-category/sub-category.module';
import { MapperModule } from '../../mapper/mapper.module';
import { EnvironmentModule } from '../../environment/environment.module';
import { PlayerModule } from '../../player/player.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryRepository]),
    SubCategoryModule,
    MapperModule,
    EnvironmentModule,
    PlayerModule,
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
