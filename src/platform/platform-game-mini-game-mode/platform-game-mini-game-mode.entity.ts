import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { PlatformGameMiniGame } from '../platform-game-mini-game/platform-game-mini-game.entity';
import { Mode } from '../../mode/mode.entity';
import { PlatformGameMiniGameModeStage } from '../platform-game-mini-game-mode-stage/platform-game-mini-game-mode-stage.entity';

@Unique(['idPlatformGameMiniGame', 'idMode'])
@Entity()
export class PlatformGameMiniGameMode extends BaseEntity {
  @Column()
  idPlatformGameMiniGame!: number;

  @ManyToOne(() => PlatformGameMiniGame)
  @JoinColumn()
  platformGameMiniGame!: PlatformGameMiniGame;

  @Column()
  idMode!: number;

  @ManyToOne(() => Mode)
  @JoinColumn()
  mode!: Mode;

  @OneToMany(
    () => PlatformGameMiniGameModeStage,
    platformGameMiniGameModeStage => platformGameMiniGameModeStage.platformGameMiniGameMode
  )
  platformGameMiniGameModeStages!: PlatformGameMiniGameModeStage[];
}
