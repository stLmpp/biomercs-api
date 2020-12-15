import { EntityRepository, Repository } from 'typeorm';
import { ScoreApproval } from './score-approval.entity';

@EntityRepository(ScoreApproval)
export class ScoreApprovalRepository extends Repository<ScoreApproval> {}
