import { CharacterInterface } from './character.interface';
import { Property } from '../mapper/property.decorator';
import { CharacterCostumeViewModel } from './character-costume/character-costume.view-model';

export class CharacterViewModel implements CharacterInterface {
  @Property() id!: number;
  @Property() name!: string;
}

export class CharacterViewModelWithCharacterCostumes extends CharacterViewModel {
  @Property(() => CharacterCostumeViewModel) characterCostumes!: CharacterCostumeViewModel[];
}
