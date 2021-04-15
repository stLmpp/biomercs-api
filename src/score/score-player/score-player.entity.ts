import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { Score } from '../score.entity';
import { Player } from '../../player/player.entity';
import { PlatformGameMiniGameModeCharacterCostume } from '../../platform/platform-game-mini-game-mode-character-costume/platform-game-mini-game-mode-character-costume.entity';
import { Property } from '../../mapper/property.decorator';

@Entity({ orderBy: { host: 'DESC', id: 'ASC' } })
export class ScorePlayer extends BaseEntity {
  @Property()
  @Column()
  idScore!: number;

  @Property(() => Score)
  @ManyToOne(() => Score)
  @JoinColumn()
  score!: Score;

  @Property()
  @Column()
  idPlayer!: number;

  @Property(() => Player)
  @ManyToOne(() => Player)
  @JoinColumn()
  player!: Player;

  @Property()
  @Column()
  idPlatformGameMiniGameModeCharacterCostume!: number;

  @Property(() => PlatformGameMiniGameModeCharacterCostume)
  @ManyToOne(() => PlatformGameMiniGameModeCharacterCostume)
  @JoinColumn()
  platformGameMiniGameModeCharacterCostume!: PlatformGameMiniGameModeCharacterCostume;

  @Property()
  @Column({ default: false })
  host!: boolean;

  @Property()
  @Column({ nullable: true })
  bulletKills!: number;

  @Property()
  @Column({ nullable: true, length: 1000 })
  description?: string;

  @Property()
  @Column({ length: 1000 })
  evidence!: string;
}
