import { EntityRepository, Repository } from 'typeorm';
import { ScoreChangeRequest } from './score-change-request.entity';

@EntityRepository(ScoreChangeRequest)
export class ScoreChangeRequestRepository extends Repository<ScoreChangeRequest> {}
