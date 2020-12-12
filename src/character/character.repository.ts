import { EntityRepository, Repository } from 'typeorm';
import { Character } from './character.entity';

@EntityRepository(Character)
export class CharacterRepository extends Repository<Character> {}
