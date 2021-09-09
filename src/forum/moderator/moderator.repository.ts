import { EntityRepository, Repository } from 'typeorm';
import { Moderator } from './moderator.entity';

@EntityRepository(Moderator)
export class ModeratorRepository extends Repository<Moderator> {
  async findAll(): Promise<Moderator[]> {
    return this.createQueryBuilder('m')
      .leftJoinAndSelect('m.subCategoryModerators', 'sbm')
      .innerJoinAndSelect('m.player', 'p')
      .orderBy('p.personaName', 'ASC')
      .getMany();
  }

  async findBySubCategory(idSubCategory: number): Promise<Moderator[]> {
    return this.createQueryBuilder('m')
      .leftJoinAndSelect('m.subCategoryModerators', 'sbm')
      .innerJoinAndSelect('m.player', 'p')
      .orderBy('p.personaName', 'ASC')
      .andWhere('sbm.idSubCategory = :idSubCategory', { idSubCategory })
      .getMany();
  }
}
