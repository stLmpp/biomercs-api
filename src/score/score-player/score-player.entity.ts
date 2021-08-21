import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { Score } from '../score.entity';
import { Player } from '../../player/player.entity';
import { PlatformGameMiniGameModeCharacterCostume } from '../../platform/platform-game-mini-game-mode-character-costume/platform-game-mini-game-mode-character-costume.entity';
import { Property } from '../../mapper/property.decorator';
import { SchemaEnum } from '../../environment/schema.enum';
import { PlatformInputType } from '../../platform/platform-input-type/platform-input-type.entity';

@Entity({ schema: SchemaEnum.main, orderBy: { host: 'DESC', id: 'ASC' } })
export class ScorePlayer extends BaseEntity {
  @Property()
  @Column()
  @Index()
  idScore!: number;

  @Property(() => Score)
  @ManyToOne(() => Score, score => score.scorePlayers)
  @JoinColumn()
  score!: Score;

  @Property()
  @Column()
  idPlayer!: number;

  @Property(() => Player)
  @ManyToOne(() => Player, player => player.scorePlayers)
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
  bulletKills?: number;

  @Property()
  @Column({ nullable: true, length: 1000 })
  description?: string;

  @Property()
  @Column({ length: 1000 })
  evidence!: string;

  @Property()
  @Column({ type: 'int', nullable: true })
  idPlatformInputType?: number | null;

  @Property(() => PlatformInputType)
  @ManyToOne(() => PlatformInputType)
  @JoinColumn()
  platformInputType?: PlatformInputType | null;
}
