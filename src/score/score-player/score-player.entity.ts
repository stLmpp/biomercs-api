import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { Score } from '../score.entity';
import { Player } from '../../player/player.entity';
import { PlatformGameMiniGameModeCharacterCostume } from '../../platform/platform-game-mini-game-mode-character-costume/platform-game-mini-game-mode-character-costume.entity';
import { Property } from '../../mapper/property.decorator';
import { InputType } from '../../input-type/input-type.entity';
import { SchemaEnum } from '../../environment/schema.enum';

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
  @Column({ nullable: true })
  idInputType?: number;

  @Property(() => InputType)
  @ManyToOne(() => InputType, { nullable: true })
  @JoinColumn()
  inputType?: InputType;
}
