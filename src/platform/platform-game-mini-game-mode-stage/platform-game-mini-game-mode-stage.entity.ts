import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { PlatformGameMiniGameMode } from '../platform-game-mini-game-mode/platform-game-mini-game-mode.entity';
import { Stage } from '../../stage/stage.entity';
import { Property } from '../../mapper/property.decorator';
import { PlatformGameMiniGameModeStageInterface } from './platform-game-mini-game-mode-stage.interface';

@Unique(['idPlatformGameMiniGameMode', 'idStage'])
@Entity()
export class PlatformGameMiniGameModeStage extends BaseEntity implements PlatformGameMiniGameModeStageInterface {
  @Property()
  @Column()
  idPlatformGameMiniGameMode!: number;

  @Property(() => PlatformGameMiniGameMode)
  @ManyToOne(() => PlatformGameMiniGameMode)
  @JoinColumn()
  platformGameMiniGameMode!: PlatformGameMiniGameMode;

  @Property()
  @Column()
  idStage!: number;

  @Property(() => Stage)
  @ManyToOne(() => Stage, stage => stage.platformGameMiniGameModeStages)
  @JoinColumn()
  stage!: Stage;
}
