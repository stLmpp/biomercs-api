import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CategoryAddDto, CategoryUpdateDto } from './category.dto';
import { Category } from './category.entity';
import { SubCategoryService } from '../sub-category/sub-category.service';
import { CategoriesWithRecentTopicsViewModel, CategoryWithSubCategoriesViewModel } from './category.view-model';
import { InjectMapProfile } from '../../mapper/inject-map-profile';
import { MapProfile } from '../../mapper/map-profile';
import { UserService } from '../../user/user.service';
import { UpdateResult } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { orderBy } from 'st-utils';
import { TopicService } from '../topic/topic.service';
import { Topic } from '../topic/topic.entity';
import { TopicRecentViewModel } from '../topic/topic.view-model';

@Injectable()
export class CategoryService {
  constructor(
    private categoryRepository: CategoryRepository,
    private subCategoryService: SubCategoryService,
    @InjectMapProfile(Category, CategoryWithSubCategoriesViewModel)
    private mapProfile: MapProfile<Category, CategoryWithSubCategoriesViewModel>,
    private userService: UserService,
    private topicService: TopicService,
    @InjectMapProfile(Topic, TopicRecentViewModel)
    private mapProfileTopicRecent: MapProfile<Topic, TopicRecentViewModel>
  ) {}

  private async _findAllWithInfo(idPlayer: number): Promise<CategoryWithSubCategoriesViewModel[]> {
    const isAdmin = await this.userService.isAdminByPlayer(idPlayer);
    const [categories, subCategoriesInfo] = await Promise.all([
      this.categoryRepository
        .find({
          relations: [
            'subCategories',
            'subCategories.subCategoryModerators',
            'subCategories.subCategoryModerators.moderator',
            'subCategories.subCategoryModerators.moderator.player',
          ],
          withDeleted: isAdmin,
        })
        .then(_categories => this.mapProfile.map(_categories)),
      this.subCategoryService.findAllWithInfo(idPlayer, isAdmin),
    ]);
    for (const category of categories) {
      category.subCategories = orderBy(category.subCategories, 'order');
      for (const subCategory of category.subCategories) {
        const subCategoryInfo = subCategoriesInfo.find(_subCategoryInfo => _subCategoryInfo.id === subCategory.id);
        Object.assign(subCategory, subCategoryInfo);
        subCategory.isModerator = subCategory.isModerator || isAdmin;
      }
    }
    return categories;
  }

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

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: ['subCategories'] });
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

  async findById(idCategory: number, idPlayer: number): Promise<Category> {
    const isAdmin = await this.userService.isAdminByPlayer(idPlayer);
    return this.categoryRepository.findOneOrFail(idCategory, { withDeleted: isAdmin });
  }

  async findAllWithRecentTopics(idPlayer: number): Promise<CategoriesWithRecentTopicsViewModel> {
    const [categories, topics] = await Promise.all([
      this._findAllWithInfo(idPlayer),
      this.topicService.findRecentTopics(3),
    ]);
    const recentTopics = this.mapProfileTopicRecent.map(topics);
    return new CategoriesWithRecentTopicsViewModel(categories, recentTopics);
  }
}
