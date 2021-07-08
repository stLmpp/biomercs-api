import { CharacterInterface } from './character.interface';
import { Property } from '../mapper/property.decorator';

export class CharacterViewModel implements CharacterInterface {
  @Property() id!: number;
  @Property() name!: string;
}
