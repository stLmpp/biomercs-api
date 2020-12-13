import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { GameMiniGame } from './game-mini-game/game-mini-game.entity';

@Entity()
export class Game extends BaseEntity {
  @Column() name!: string;
  @Column({ length: 10 }) shortName!: string;

  @OneToMany(() => GameMiniGame, gameMiniGame => gameMiniGame.game)
  gameMiniGames!: GameMiniGame[];
}
