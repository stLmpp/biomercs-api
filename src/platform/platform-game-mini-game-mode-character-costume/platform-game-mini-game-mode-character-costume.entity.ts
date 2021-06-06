import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { PlatformGameMiniGameMode } from '../platform-game-mini-game-mode/platform-game-mini-game-mode.entity';
import { CharacterCostume } from '../../character/character-costume/character-costume.entity';
import { Property } from '../../mapper/property.decorator';

@Unique(['idPlatformGameMiniGameMode', 'idCharacterCostume'])
@Entity()
export class PlatformGameMiniGameModeCharacterCostume extends BaseEntity {
  @Property()
  @Column()
  idPlatformGameMiniGameMode!: number;

  @Property(() => PlatformGameMiniGameMode)
  @ManyToOne(
    () => PlatformGameMiniGameMode,
    platformGameMiniGameMode => platformGameMiniGameMode.platformGameMiniGameModeCharacterCostumes
  )
  @JoinColumn()
  platformGameMiniGameMode!: PlatformGameMiniGameMode;

  @Property()
  @Column()
  idCharacterCostume!: number;

  @Property(() => CharacterCostume)
  @ManyToOne(() => CharacterCostume, characterCostume => characterCostume.platformGameMiniGameModeCharacterCostumes)
  @JoinColumn()
  characterCostume!: CharacterCostume;
}
