import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { PlatformGameMiniGameMode } from '../platform-game-mini-game-mode/platform-game-mini-game-mode.entity';
import { CharacterCostume } from '../../character/character-costume/character-costume.entity';

@Unique(['idPlatformGameMiniGameMode', 'idCharacterCostume'])
@Entity()
export class PlatformGameMiniGameModeCharacterCostume extends BaseEntity {
  @Column()
  idPlatformGameMiniGameMode!: number;

  @ManyToOne(() => PlatformGameMiniGameMode)
  @JoinColumn()
  platformGameMiniGameMode!: PlatformGameMiniGameMode;

  @Column()
  idCharacterCostume!: number;

  @ManyToOne(() => CharacterCostume)
  @JoinColumn()
  characterCostume!: CharacterCostume;
}
