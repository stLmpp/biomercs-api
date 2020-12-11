import { EntityRepository, Repository } from 'typeorm';
import { PlatformGameMiniGame } from './platform-game-mini-game.entity';

@EntityRepository(PlatformGameMiniGame)
export class PlatformGameMiniGameRepository extends Repository<PlatformGameMiniGame> {}
