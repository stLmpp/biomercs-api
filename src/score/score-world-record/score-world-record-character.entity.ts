import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { PlatformGameMiniGameModeCharacterCostume } from '../../platform/platform-game-mini-game-mode-character-costume/platform-game-mini-game-mode-character-costume.entity';
import { ScoreWorldRecord } from './score-world-record.entity';
import { Property } from '../../mapper/property.decorator';

@Entity()
export class ScoreWorldRecordCharacter extends BaseEntity {
  @Property()
  @Column()
  idScoreWorldRecord!: number;

  @Property(() => ScoreWorldRecord)
  @ManyToOne(() => ScoreWorldRecord, scoreWorldRecord => scoreWorldRecord.scoreWorldRecordCharacters)
  @JoinColumn()
  scoreWorldRecord!: ScoreWorldRecord;

  @Property(() => PlatformGameMiniGameModeCharacterCostume)
  @ManyToOne(() => PlatformGameMiniGameModeCharacterCostume)
  @JoinColumn()
  platformGameMiniGameModeCharacterCostume!: PlatformGameMiniGameModeCharacterCostume;

  @Property()
  @Column()
  idPlatformGameMiniGameModeCharacterCostume!: number;
}
