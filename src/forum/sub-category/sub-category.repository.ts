import { EntityRepository, Repository } from 'typeorm';
import { SubCategory } from './sub-category.entity';

@EntityRepository(SubCategory)
export class SubCategoryRepository extends Repository<SubCategory> {}
