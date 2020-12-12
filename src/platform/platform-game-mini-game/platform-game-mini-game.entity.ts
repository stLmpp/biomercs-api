import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { Platform } from '../platform.entity';
import { GameMiniGame } from '../../game/game-mini-game/game-mini-game.entity';

@Entity()
export class PlatformGameMiniGame extends BaseEntity {
  @Column() idPlatform!: number;

  @ManyToOne(() => Platform)
  @JoinColumn()
  platform!: Platform;

  @Column() idGameMiniGame!: number;

  @ManyToOne(() => GameMiniGame)
  @JoinColumn()
  gameMiniGame!: GameMiniGame;
}
