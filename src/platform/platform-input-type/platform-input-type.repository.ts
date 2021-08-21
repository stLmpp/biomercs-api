import { EntityRepository, Repository } from 'typeorm';
import { PlatformInputType } from './platform-input-type.entity';

@EntityRepository(PlatformInputType)
export class PlatformInputTypeRepository extends Repository<PlatformInputType> {
  async findIdByPlatformPlayer(idPlatform: number, idPlayer: number): Promise<number | undefined> {
    return this.createQueryBuilder('pit')
      .select('pit.id')
      .innerJoin('pit.inputType', 'it')
      .innerJoin('it.players', 'p')
      .andWhere('p.id = :idPlayer', { idPlayer })
      .andWhere('pit.idPlatform = :idPlatform', { idPlatform })
      .getOne()
      .then(platformInputType => platformInputType?.id);
  }
}
