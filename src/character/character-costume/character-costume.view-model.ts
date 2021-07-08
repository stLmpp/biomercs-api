import { CharacterCostumeInterface } from './character-costume.interface';
import { Property } from '../../mapper/property.decorator';

export class CharacterCostumeViewModel implements CharacterCostumeInterface {
  @Property() id!: number;
  @Property() idCharacter!: number;
  @Property() name!: string;
  @Property() shortName!: string;
}
