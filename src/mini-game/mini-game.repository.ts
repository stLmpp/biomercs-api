import { EntityRepository, Repository } from 'typeorm';
import { MiniGame } from './mini-game.entity';

@EntityRepository(MiniGame)
export class MiniGameRepository extends Repository<MiniGame> {}
