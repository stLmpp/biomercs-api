import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { Platform } from '../platform.entity';
import { GameMiniGame } from '../../game/game-mini-game/game-mini-game.entity';

@Unique(['idPlatform', 'idGameMiniGame'])
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
