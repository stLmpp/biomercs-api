import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { Score } from '../score.entity';
import { ScoreWorldRecordTypeEnum } from './score-world-record-type.enum';
import { PlatformGameMiniGameModeStage } from '../../platform/platform-game-mini-game-mode-stage/platform-game-mini-game-mode-stage.entity';
import { ScoreWorldRecordCharacter } from './score-world-record-character.entity';
import { Property } from '../../mapper/property.decorator';
import { SchemaEnum } from '../../environment/schema.enum';

@Entity({ schema: SchemaEnum.main })
export class ScoreWorldRecord extends BaseEntity {
  @Property()
  @Column()
  idScore!: number;

  @Property(() => Score)
  @ManyToOne(() => Score, score => score.scoreWorldRecords)
  @JoinColumn()
  score!: Score;

  @Property()
  @Column({ enum: ScoreWorldRecordTypeEnum, type: 'enum' })
  type!: ScoreWorldRecordTypeEnum;

  @Property(() => PlatformGameMiniGameModeStage)
  @ManyToOne(() => PlatformGameMiniGameModeStage)
  @JoinColumn()
  platformGameMiniGameModeStage!: PlatformGameMiniGameModeStage;

  @Property()
  @Column()
  idPlatformGameMiniGameModeStage!: number;

  @Property(() => ScoreWorldRecordCharacter)
  @OneToMany(() => ScoreWorldRecordCharacter, scoreWorldRecordCharacter => scoreWorldRecordCharacter.scoreWorldRecord, {
    cascade: ['insert'],
  })
  scoreWorldRecordCharacters!: ScoreWorldRecordCharacter[];

  @Property()
  @Column({ nullable: true })
  endDate?: Date;
}
