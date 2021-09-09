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

  async search(term: string, idModeratorsSelected: number[]): Promise<Moderator[]> {
    const queryBuilder = this.createQueryBuilder('m')
      .innerJoinAndSelect('m.player', 'p')
      .andWhere('p.personaName ilike :term', { term: `%${term}%` })
      .orderBy('p.personaName', 'ASC')
      .take(150);
    if (idModeratorsSelected.length) {
      queryBuilder.andWhere('m.id not in (:...idModeratorsSelected)', { idModeratorsSelected });
    }
    return queryBuilder.getMany();
  }
}
