import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { PlatformGameMiniGameModeStage } from '../platform/platform-game-mini-game-mode-stage/platform-game-mini-game-mode-stage.entity';
import { ScoreStatusEnum } from './score-status.enum';
import { ScorePlayer } from './score-player/score-player.entity';
import { Player } from '../player/player.entity';
import { ScoreWorldRecord } from './score-world-record/score-world-record.entity';
import { ScoreChangeRequest } from './score-change-request/score-change-request.entity';
import { Property } from '../mapper/property.decorator';

@Entity()
export class Score extends BaseEntity {
  @Property()
  @Column()
  idPlatformGameMiniGameModeStage!: number;

  @Property(() => PlatformGameMiniGameModeStage)
  @ManyToOne(() => PlatformGameMiniGameModeStage)
  @JoinColumn()
  platformGameMiniGameModeStage!: PlatformGameMiniGameModeStage;

  @Property()
  @Column()
  score!: number;

  @Property()
  @Column()
  maxCombo!: number;

  @Property()
  @Column({ length: 8 })
  time!: string;

  @Property()
  @Column({ type: 'enum', enum: ScoreStatusEnum })
  @Index()
  status!: ScoreStatusEnum;

  @Property(() => ScorePlayer)
  @OneToMany(() => ScorePlayer, scorePlayer => scorePlayer.score)
  scorePlayers!: ScorePlayer[];

  @Property()
  @Column()
  createdByIdPlayer!: number;

  @Property(() => Player)
  @ManyToOne(() => Player)
  @JoinColumn({ name: 'createdByIdPlayer' })
  createdByPlayer!: Player;

  @Property(() => ScoreWorldRecord)
  @OneToMany(() => ScoreWorldRecord, scoreWorldRecord => scoreWorldRecord.score)
  scoreWorldRecords!: ScoreWorldRecord[];

  @Property()
  @Column({ nullable: true })
  approvalDate?: Date;

  @Property(() => ScoreChangeRequest)
  @OneToMany(() => ScoreChangeRequest, scoreChangeRequest => scoreChangeRequest.score)
  scoreChangeRequests!: ScoreChangeRequest[];
}
