import { EntityRepository, Repository } from 'typeorm';
import { InputType } from './input-type.entity';

@EntityRepository(InputType)
export class InputTypeRepository extends Repository<InputType>{
  
}
