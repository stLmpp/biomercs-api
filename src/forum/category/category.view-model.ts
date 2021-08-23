import { CategoryInterface } from './category.interface';
import { Property } from '../../mapper/property.decorator';
import { SubCategoryViewModel } from '../sub-category/sub-category.view-model';

export class CategoryViewModel implements CategoryInterface {
  @Property() id!: number;
  @Property() name!: string;
  @Property(() => SubCategoryViewModel) subCategories!: SubCategoryViewModel[];
}
