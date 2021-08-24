import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CategoryAddDto, CategoryUpdateDto, CategoryUpsertDto } from './category.dto';
import { Category } from './category.entity';
import { filterDeleted } from '../../util/filter-deleted';
import { filterRestored } from '../../util/filter-restored';
import { filterId } from '../../util/filter-id';
import { SubCategoryUpsertWithCategoryDto } from '../sub-category/sub-category.dto';
import { SubCategoryService } from '../sub-category/sub-category.service';
import { CategoryWithSubCategoriesViewModel } from './category.view-model';
import { InjectMapProfile } from '../../mapper/inject-map-profile';
import { MapProfile } from '../../mapper/map-profile';
import { UserService } from '../../user/user.service';
import { UpdateResult } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    private categoryRepository: CategoryRepository,
    private subCategoryService: SubCategoryService,
    @InjectMapProfile(Category, CategoryWithSubCategoriesViewModel)
    private mapProfile: MapProfile<Category, CategoryWithSubCategoriesViewModel>,
    private userService: UserService
  ) {}

  @Transactional()
  async upsert(dtos: CategoryUpsertDto[], idPlayer: number): Promise<CategoryWithSubCategoriesViewModel[]> {
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

  async add(dto: CategoryAddDto): Promise<Category> {
    const lastOrder = await this.categoryRepository
      .findOne({ order: { order: 'DESC' }, select: ['order'] })
      .then(category => category?.order ?? 0);
    return this.categoryRepository.save({ ...dto, order: lastOrder + 1 });
  }

  async update(
    idCategory: number,
    { deleted, restored, ...dto }: CategoryUpdateDto,
    idPlayer: number
  ): Promise<Category> {
    const promises: Promise<UpdateResult>[] = [this.categoryRepository.update(idCategory, dto)];
    if (deleted) {
      promises.push(this.categoryRepository.softDelete(idCategory));
    }
    if (restored) {
      promises.push(this.categoryRepository.restore(idCategory));
    }
    await Promise.all(promises);
    return this.findById(idCategory, idPlayer);
  }

  async updateOrder(idCategories: number[]): Promise<void> {
    const dtos: Partial<Category>[] = idCategories.map((id, index) => ({ id, order: index + 1 }));
    await this.categoryRepository.save(dtos);
  }

  async findAll(idPlayer: number): Promise<CategoryWithSubCategoriesViewModel[]> {
    const isAdmin = await this.userService.isAdminByPlayer(idPlayer);
    const categories = this.mapProfile.map(
      await this.categoryRepository.find({
        relations: [
          'subCategories',
          'subCategories.subCategoryModerators',
          'subCategories.subCategoryModerators.moderator',
          'subCategories.subCategoryModerators.moderator.player',
        ],
        withDeleted: isAdmin,
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

  async findById(idCategory: number, idPlayer: number): Promise<Category> {
    const isAdmin = await this.userService.isAdminByPlayer(idPlayer);
    return this.categoryRepository.findOneOrFail(idCategory, { withDeleted: isAdmin });
  }
}
