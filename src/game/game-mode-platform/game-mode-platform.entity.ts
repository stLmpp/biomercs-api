import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonColumns } from '../../shared/super/common-columns';
import { GameMode } from '../game-mode/game-mode.entity';
import { Platform } from '../platform/platform.entity';

@Entity()
export class GameModePlatform extends CommonColumns {
  @Column()
  idGameMode: number;

  @ManyToOne(
    () => GameMode,
    gameMode => gameMode.gameModePlatforms
  )
  @JoinColumn()
  gameMode: GameMode;

  @Column()
  idPlatform: number;

  @ManyToOne(
    () => Platform,
    platform => platform.gameModePlatforms
  )
  @JoinColumn()
  platform: Platform;
}
