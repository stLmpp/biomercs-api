import { Module } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryController } from './sub-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategoryRepository } from './sub-category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategoryRepository])],
  providers: [SubCategoryService],
  controllers: [SubCategoryController],
})
export class SubCategoryModule {}
