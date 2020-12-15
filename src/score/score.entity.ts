import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { PlatformGameMiniGameModeStage } from '../platform/platform-game-mini-game-mode-stage/platform-game-mini-game-mode-stage.entity';
import { ScoreStatusEnum } from './score-status.enum';
import { ScorePlayer } from './score-player/score-player.entity';

@Entity()
export class Score extends BaseEntity {
  @Column()
  idPlatformGameMiniGameModeStage!: number;

  @ManyToOne(() => PlatformGameMiniGameModeStage)
  @JoinColumn()
  platformGameMiniGameModeStage!: PlatformGameMiniGameModeStage;

  @Column()
  score!: number;

  @Column()
  maxCombo!: number;

  @Column({ length: 8 })
  time!: string;

  @Column({ nullable: true })
  dateAchieved?: Date;

  @Column({ type: 'enum', enum: ScoreStatusEnum })
  status!: ScoreStatusEnum;

  @OneToMany(() => ScorePlayer, scorePlayer => scorePlayer.score)
  scorePlayers!: ScorePlayer[];
}
