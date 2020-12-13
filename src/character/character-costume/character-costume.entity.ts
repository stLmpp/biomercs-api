import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { Character } from '../character.entity';
import { PlatformGameMiniGameModeCharacterCostume } from '../../platform/platform-game-mini-game-mode-character-costume/platform-game-mini-game-mode-character-costume.entity';

@Entity()
export class CharacterCostume extends BaseEntity {
  @Column()
  idCharacter!: number;

  @ManyToOne(() => Character)
  @JoinColumn()
  character!: Character;

  @Column()
  name!: string;

  @Column({ length: 15 })
  shortName!: string;

  @OneToMany(
    () => PlatformGameMiniGameModeCharacterCostume,
    platformGameMiniGameModeCharacterCostume => platformGameMiniGameModeCharacterCostume.characterCostume
  )
  platformGameMiniGameModeCharacterCostumes!: PlatformGameMiniGameModeCharacterCostume[];
}
