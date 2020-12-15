import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { Score } from '../score.entity';
import { Player } from '../../player/player.entity';
import { PlatformGameMiniGameModeCharacterCostume } from '../../platform/platform-game-mini-game-mode-character-costume/platform-game-mini-game-mode-character-costume.entity';

@Entity()
export class ScorePlayer extends BaseEntity {
  @Column()
  idScore!: number;

  @ManyToOne(() => Score)
  @JoinColumn()
  score!: Score;

  @Column()
  idPlayer!: number;

  @ManyToOne(() => Player)
  @JoinColumn()
  player!: Player;

  @Column()
  idPlatformGameMiniGameModeCharacterCostume!: number;

  @ManyToOne(() => PlatformGameMiniGameModeCharacterCostume)
  @JoinColumn()
  platformGameMiniGameModeCharacterCostume!: PlatformGameMiniGameModeCharacterCostume;

  @Column({ default: false })
  host!: boolean;

  @Column({ nullable: true })
  bulletKills!: number;

  @Column({ nullable: true, length: 1000 })
  description?: string;

  @Column({ length: 1000 })
  evidence!: string;
}
