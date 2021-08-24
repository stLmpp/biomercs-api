import { CategoryInterface } from './category.interface';
import { Property } from '../../mapper/property.decorator';
import { SubCategoryWithModeratorsViewModel } from '../sub-category/sub-category.view-model';

export class CategoryViewModel implements CategoryInterface {
  @Property() id!: number;
  @Property() name!: string;
  @Property() deletedDate?: Date;
  @Property() order!: number;
}

export class CategoryWithSubCategoriesViewModel extends CategoryViewModel {
  @Property(() => SubCategoryWithModeratorsViewModel) subCategories!: SubCategoryWithModeratorsViewModel[];
}
