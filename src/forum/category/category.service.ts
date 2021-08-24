import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CategoryUpsertDto } from './category.dto';
import { Category } from './category.entity';
import { filterDeleted } from '../../util/filter-deleted';
import { filterRestored } from '../../util/filter-restored';
import { filterId } from '../../util/filter-id';
import { SubCategoryUpsertWithCategoryDto } from '../sub-category/sub-category.dto';
import { SubCategoryService } from '../sub-category/sub-category.service';
import { CategoryViewModel } from './category.view-model';
import { InjectMapProfile } from '../../mapper/inject-map-profile';
import { MapProfile } from '../../mapper/map-profile';

@Injectable()
export class CategoryService {
  constructor(
    private categoryRepository: CategoryRepository,
    private subCategoryService: SubCategoryService,
    @InjectMapProfile(Category, CategoryViewModel) private mapProfile: MapProfile<Category, CategoryViewModel>
  ) {}

  @Transactional()
  async upsert(dtos: CategoryUpsertDto[], idPlayer: number): Promise<CategoryViewModel[]> {
    const deleted = filterDeleted(dtos);
    if (deleted.length) {
      await this.categoryRepository.softDelete(deleted.map(dto => dto.id));
    }
    const restored = filterRestored(dtos);
    if (restored.length) {
      await this.categoryRepository.restore(restored.map(dto => dto.id));
    }
    const dtoAdded = dtos.filter(dto => !dto.id);
    const newCategories = await this.categoryRepository.save(dtoAdded);
    const idCategories = newCategories.map(category => category.id);
    const subCategoriesDtoAdded: SubCategoryUpsertWithCategoryDto[] = newCategories.reduce(
      (subCategories, category) => [
        ...subCategories,
        ...category.subCategories.map(
          subCategory => new SubCategoryUpsertWithCategoryDto({ ...subCategory, idCategory: category.id })
        ),
      ],
      [] as SubCategoryUpsertWithCategoryDto[]
    );
    const dtoUpdated = filterId(dtos);
    const subCategoriesDtoUpdated: SubCategoryUpsertWithCategoryDto[] = dtoUpdated.reduce(
      (subCategories, category) => [
        ...subCategories,
        ...category.subCategories.map(
          subCategory => new SubCategoryUpsertWithCategoryDto({ ...subCategory, idCategory: category.id })
        ),
      ],
      [] as SubCategoryUpsertWithCategoryDto[]
    );
    await this.categoryRepository.save(dtoUpdated);
    idCategories.push(...dtoUpdated.map(dto => dto.id));
    await this.subCategoryService.upsert([...subCategoriesDtoAdded, ...subCategoriesDtoUpdated]);
    return this.findAll(idPlayer);
  }

  async findAll(idPlayer: number): Promise<CategoryViewModel[]> {
    const categories = this.mapProfile.map(
      await this.categoryRepository.find({
        relations: [
          'subCategories',
          'subCategories.subCategoryModerators',
          'subCategories.subCategoryModerators.moderator',
          'subCategories.subCategoryModerators.moderator.player',
        ],
      })
    );
    for (const category of categories) {
      for (const subCategory of category.subCategories) {
        const subCategoryInfo = await this.subCategoryService.findSubCategoryInfo(subCategory.id, idPlayer);
        Object.assign(subCategory, subCategoryInfo);
      }
    }
    return categories;
  }
}
