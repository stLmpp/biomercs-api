import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { Platform } from '../platform.entity';
import { GameMiniGame } from '../../game/game-mini-game/game-mini-game.entity';
import { Property } from '../../mapper/property.decorator';

@Unique(['idPlatform', 'idGameMiniGame'])
@Entity()
export class PlatformGameMiniGame extends BaseEntity {
  @Property()
  @Column()
  idPlatform!: number;

  @Property(() => Platform)
  @ManyToOne(() => Platform)
  @JoinColumn()
  platform!: Platform;

  @Property()
  @Column()
  idGameMiniGame!: number;

  @Property(() => GameMiniGame)
  @ManyToOne(() => GameMiniGame)
  @JoinColumn()
  gameMiniGame!: GameMiniGame;
}
