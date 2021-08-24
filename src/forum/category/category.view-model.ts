import { CategoryInterface } from './category.interface';
import { Property } from '../../mapper/property.decorator';
import { SubCategoryViewModel } from '../sub-category/sub-category.view-model';

export class CategoryViewModel implements CategoryInterface {
  @Property() id!: number;
  @Property() name!: string;
  @Property() deletedDate?: Date;
}

export class CategoryWithSubCategoriesViewModel extends CategoryViewModel {
  @Property(() => SubCategoryViewModel) subCategories!: SubCategoryViewModel[];
}
