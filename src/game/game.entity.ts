import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { GameMiniGame } from './game-mini-game/game-mini-game.entity';

@Entity()
export class Game extends BaseEntity {
  @Column()
  @Index()
  name!: string;

  @Column({ length: 10 })
  @Index()
  shortName!: string;

  @OneToMany(() => GameMiniGame, gameMiniGame => gameMiniGame.game)
  gameMiniGames!: GameMiniGame[];
}
