import { EntityRepository, Repository } from 'typeorm';
import { SubCategoryModerator } from './sub-category-moderator.entity';

@EntityRepository(SubCategoryModerator)
export class SubCategoryModeratorRepository extends Repository<SubCategoryModerator> {
  async isModerator(idSubCategory: number, idPlayer: number): Promise<boolean> {
    return this.createQueryBuilder('scm')
      .select('scm.id')
      .innerJoin('scm.moderator', 'm')
      .andWhere('scm.idSubCategory = :idSubCategory', { idSubCategory })
      .andWhere('m.idPlayer = :idPlayer', { idPlayer })
      .getOne()
      .then(scm => !!scm);
  }
}
