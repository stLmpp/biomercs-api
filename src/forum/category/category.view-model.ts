import { CategoryInterface } from './category.interface';
import { Property } from '../../mapper/property.decorator';
import { SubCategoryWithInfoModeratorsViewModel } from '../sub-category/sub-category.view-model';
import { TopicRecentViewModel } from '../topic/topic.view-model';

export class CategoryViewModel implements CategoryInterface {
  @Property() id!: number;
  @Property() name!: string;
  @Property() deletedDate?: Date;
  @Property() order!: number;
}

export class CategoryWithSubCategoriesViewModel extends CategoryViewModel {
  @Property(() => SubCategoryWithInfoModeratorsViewModel) subCategories!: SubCategoryWithInfoModeratorsViewModel[];
}

export class CategoriesWithRecentTopicsViewModel {
  constructor(categories: CategoryWithSubCategoriesViewModel[], recentTopics: TopicRecentViewModel[]) {
    this.categories = categories;
    this.recentTopics = recentTopics;
  }

  @Property(() => CategoryWithSubCategoriesViewModel) categories!: CategoryWithSubCategoriesViewModel[];
  @Property(() => TopicRecentViewModel) recentTopics!: TopicRecentViewModel[];
}
