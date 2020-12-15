import { EntityRepository, Repository } from 'typeorm';
import { ScoreApprovalMotive } from './score-approval-motive.entity';

@EntityRepository(ScoreApprovalMotive)
export class ScoreApprovalMotiveRepository extends Repository<ScoreApprovalMotive> {}
