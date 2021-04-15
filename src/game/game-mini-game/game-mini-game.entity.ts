import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { Game } from '../game.entity';
import { BaseEntity } from '../../shared/super/base-entity';
import { MiniGame } from '../../mini-game/mini-game.entity';
import { PlatformGameMiniGame } from '../../platform/platform-game-mini-game/platform-game-mini-game.entity';
import { Property } from '../../mapper/property.decorator';

@Unique(['idGame', 'idMiniGame'])
@Entity()
export class GameMiniGame extends BaseEntity {
  @Property()
  @Column()
  idGame!: number;

  @Property(() => Game)
  @ManyToOne(() => Game)
  @JoinColumn()
  game!: Game;

  @Property()
  @Column()
  idMiniGame!: number;

  @Property(() => MiniGame)
  @ManyToOne(() => MiniGame)
  @JoinColumn()
  miniGame!: MiniGame;

  @Property(() => PlatformGameMiniGame)
  @OneToMany(() => PlatformGameMiniGame, platformGameMiniGame => platformGameMiniGame.gameMiniGame)
  platformGameMiniGames!: PlatformGameMiniGame[];
}
