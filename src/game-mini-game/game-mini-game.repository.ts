import { EntityRepository, Repository } from 'typeorm';
import { GameMiniGame } from './game-mini-game.entity';

@EntityRepository(GameMiniGame)
export class GameMiniGameRepository extends Repository<GameMiniGame> {}
