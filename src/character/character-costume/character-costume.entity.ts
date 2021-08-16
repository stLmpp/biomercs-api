import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { Character } from '../character.entity';
import { PlatformGameMiniGameModeCharacterCostume } from '../../platform/platform-game-mini-game-mode-character-costume/platform-game-mini-game-mode-character-costume.entity';
import { Property } from '../../mapper/property.decorator';
import { CharacterCostumeInterface } from './character-costume.interface';
import { SchemaEnum } from '../../environment/schema.enum';

@Entity({ schema: SchemaEnum.main })
export class CharacterCostume extends BaseEntity implements CharacterCostumeInterface {
  @Property()
  @Column()
  idCharacter!: number;

  @Property(() => Character)
  @ManyToOne(() => Character, character => character.characterCostumes)
  @JoinColumn()
  character!: Character;

  @Property()
  @Column()
  @Index()
  name!: string;

  @Property()
  @Column({ length: 15 })
  @Index()
  shortName!: string;

  @Property(() => PlatformGameMiniGameModeCharacterCostume)
  @OneToMany(
    () => PlatformGameMiniGameModeCharacterCostume,
    platformGameMiniGameModeCharacterCostume => platformGameMiniGameModeCharacterCostume.characterCostume
  )
  platformGameMiniGameModeCharacterCostumes!: PlatformGameMiniGameModeCharacterCostume[];
}
