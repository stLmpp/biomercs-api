import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { GameMiniGame } from '../game/game-mini-game/game-mini-game.entity';

@Entity()
export class MiniGame extends BaseEntity {
  @Column() name!: string;

  @OneToMany(() => GameMiniGame, gameMiniGame => gameMiniGame.miniGame)
  gameMiniGames!: GameMiniGame[];
}
