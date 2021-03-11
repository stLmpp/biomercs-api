import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { PlatformGameMiniGameModeStage } from '../../platform/platform-game-mini-game-mode-stage/platform-game-mini-game-mode-stage.entity';
import { ValueTransformers } from '../../util/transformers';

@Entity()
export class ScoreWorldRecordSchedule extends BaseEntity {
  @ManyToOne(() => PlatformGameMiniGameModeStage)
  @JoinColumn()
  platformGameMiniGameModeStage!: PlatformGameMiniGameModeStage;

  @Column()
  idPlatformGameMiniGameModeStage!: number;

  @Column({ type: 'simple-array', transformer: ValueTransformers.SimpleArray.number })
  idPlatformGameMiniGameModeCharacterCostumes!: number[];

  @Column()
  fromDate!: Date;
}
