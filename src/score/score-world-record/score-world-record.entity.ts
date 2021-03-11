import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { Score } from '../score.entity';
import { ScoreWorldRecordTypeEnum } from './score-world-record-type.enum';
import { PlatformGameMiniGameModeStage } from '../../platform/platform-game-mini-game-mode-stage/platform-game-mini-game-mode-stage.entity';
import { ScoreWorldRecordCharacter } from './score-world-record-character.entity';

@Entity()
export class ScoreWorldRecord extends BaseEntity {
  @Column()
  idScore!: number;

  @ManyToOne(() => Score, score => score.scoreWorldRecords)
  @JoinColumn()
  score!: Score;

  @Column({ enum: ScoreWorldRecordTypeEnum, type: 'enum' })
  type!: ScoreWorldRecordTypeEnum;

  @ManyToOne(() => PlatformGameMiniGameModeStage)
  @JoinColumn()
  platformGameMiniGameModeStage!: PlatformGameMiniGameModeStage;

  @Column()
  idPlatformGameMiniGameModeStage!: number;

  @OneToMany(() => ScoreWorldRecordCharacter, scoreWorldRecordCharacter => scoreWorldRecordCharacter.scoreWorldRecord, {
    cascade: ['insert'],
  })
  scoreWorldRecordCharacters!: ScoreWorldRecordCharacter[];

  @Column({ nullable: true })
  endDate?: Date;
}
