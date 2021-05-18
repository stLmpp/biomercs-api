import { EntityRepository, Repository } from 'typeorm';
import { ScoreStatus } from './score-status.entity';

@EntityRepository(ScoreStatus)
export class ScoreStatusRepository extends Repository<ScoreStatus> {}
