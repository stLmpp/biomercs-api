import { EntityRepository, Repository } from 'typeorm';
import { SubCategoryModerator } from './sub-category-moderator.entity';

@EntityRepository(SubCategoryModerator)
export class SubCategoryModeratorRepository extends Repository<SubCategoryModerator> {}
