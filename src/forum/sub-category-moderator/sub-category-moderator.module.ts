import { Module } from '@nestjs/common';
import { SubCategoryModeratorService } from './sub-category-moderator.service';
import { SubCategoryModeratorController } from './sub-category-moderator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategoryModeratorRepository } from './sub-category-moderator.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategoryModeratorRepository])],
  providers: [SubCategoryModeratorService],
  controllers: [SubCategoryModeratorController],
})
export class SubCategoryModeratorModule {}
