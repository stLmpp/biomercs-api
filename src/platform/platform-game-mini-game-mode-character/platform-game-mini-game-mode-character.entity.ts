import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { PlatformGameMiniGameMode } from '../platform-game-mini-game-mode/platform-game-mini-game-mode.entity';
import { Character } from '../../character/character.entity';

@Entity()
export class PlatformGameMiniGameModeCharacter extends BaseEntity {
  @Column()
  idGameMiniGameMode!: number;

  @ManyToOne(() => PlatformGameMiniGameMode)
  @JoinColumn()
  gameMiniGameMode!: PlatformGameMiniGameMode;

  @Column()
  idCharacter!: number;

  @ManyToOne(() => Character)
  @JoinColumn()
  character!: Character;
}
