import { EntityRepository, Repository } from 'typeorm';
import { ScorePlayer } from './score-player.entity';

@EntityRepository(ScorePlayer)
export class ScorePlayerRepository extends Repository<ScorePlayer> {}
