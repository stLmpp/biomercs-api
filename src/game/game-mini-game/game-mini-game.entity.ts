import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Game } from '../game.entity';
import { BaseEntity } from '../../shared/super/base-entity';
import { MiniGame } from '../../mini-game/mini-game.entity';

@Unique(['idGame', 'idMiniGame'])
@Entity()
export class GameMiniGame extends BaseEntity {
  @Column() idGame!: number;

  @ManyToOne(() => Game)
  @JoinColumn()
  game!: Game;

  @Column() idMiniGame!: number;

  @ManyToOne(() => MiniGame)
  @JoinColumn()
  miniGame!: MiniGame;
}
