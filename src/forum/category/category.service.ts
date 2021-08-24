import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CategoryAddDto, CategoryUpdateDto } from './category.dto';
import { Category } from './category.entity';
import { SubCategoryService } from '../sub-category/sub-category.service';
import { CategoryWithSubCategoriesViewModel } from './category.view-model';
import { InjectMapProfile } from '../../mapper/inject-map-profile';
import { MapProfile } from '../../mapper/map-profile';
import { UserService } from '../../user/user.service';
import { UpdateResult } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

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

  async add(dto: CategoryAddDto): Promise<Category> {
    const lastOrder = await this.categoryRepository
      .findOne({ order: { order: 'DESC' }, select: ['order'] })
      .then(category => category?.order ?? 0);
    return this.categoryRepository.save({ ...dto, order: lastOrder + 1 });
  }

  async updateOrder(idCategories: number[]): Promise<Category[]> {
    const dtos: Partial<Category>[] = idCategories.map((id, index) => ({ id, order: index + 1 }));
    await this.categoryRepository.save(dtos);
    return this.categoryRepository.findByIds(idCategories, { withDeleted: true });
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
