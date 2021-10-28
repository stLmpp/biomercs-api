import { EntityRepository, Repository } from 'typeorm';
import { InputType } from './input-type.entity';

@EntityRepository(InputType)
export class InputTypeRepository extends Repository<InputType> {
  async findByPlatform(idPlatform: number): Promise<InputType[]> {
    return this.createQueryBuilder('it')
      .innerJoin('it.platformInputTypes', 'pit')
      .andWhere('pit.idPlatform = :idPlatform', { idPlatform })
      .getMany();
  }
}
