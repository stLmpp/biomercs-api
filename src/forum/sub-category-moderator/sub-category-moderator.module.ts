import { Module } from '@nestjs/common';
import { SubCategoryModeratorService } from './sub-category-moderator.service';
import { SubCategoryModeratorController } from './sub-category-moderator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategoryModeratorRepository } from './sub-category-moderator.repository';
import { ModeratorModule } from '../moderator/moderator.module';
import { MapperModule } from '../../mapper/mapper.module';
import { EnvironmentModule } from '../../environment/environment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubCategoryModeratorRepository]),
    ModeratorModule,
    MapperModule,
    EnvironmentModule,
  ],
  providers: [SubCategoryModeratorService],
  controllers: [SubCategoryModeratorController],
  exports: [SubCategoryModeratorService],
})
export class SubCategoryModeratorModule {}
