import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { PlatformGameMiniGameMode } from '../platform-game-mini-game-mode/platform-game-mini-game-mode.entity';
import { Stage } from '../../stage/stage.entity';

@Entity()
export class PlatformGameMiniGameModeStage extends BaseEntity {
  @Column()
  idGameMiniGameMode!: number;

  @ManyToOne(() => PlatformGameMiniGameMode)
  @JoinColumn()
  gameMiniGameMode!: PlatformGameMiniGameMode;

  @Column()
  idStage!: number;

  @ManyToOne(() => Stage)
  @JoinColumn()
  stage!: Stage;
}
