import { EntityRepository, Repository } from 'typeorm';
import { CharacterCostume } from './character-costume.entity';

@EntityRepository(CharacterCostume)
export class CharacterCostumeRepository extends Repository<CharacterCostume> {}
