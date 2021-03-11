import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { PlatformGameMiniGameModeCharacterCostume } from '../../platform/platform-game-mini-game-mode-character-costume/platform-game-mini-game-mode-character-costume.entity';
import { ScoreWorldRecord } from './score-world-record.entity';

@Entity()
export class ScoreWorldRecordCharacter extends BaseEntity {
  @Column()
  idScoreWorldRecord!: number;

  @ManyToOne(() => ScoreWorldRecord, scoreWorldRecord => scoreWorldRecord.scoreWorldRecordCharacters)
  @JoinColumn()
  scoreWorldRecord!: ScoreWorldRecord;

  @ManyToOne(() => PlatformGameMiniGameModeCharacterCostume)
  @JoinColumn()
  platformGameMiniGameModeCharacterCostume!: PlatformGameMiniGameModeCharacterCostume;

  @Column()
  idPlatformGameMiniGameModeCharacterCostume!: number;
}
