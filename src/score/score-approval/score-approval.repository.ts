import { EntityRepository, Repository } from 'typeorm';
import { ScoreApproval } from './score-approval.entity';
import { ScoreApprovalActionEnum } from './score-approval-action.enum';

@EntityRepository(ScoreApproval)
export class ScoreApprovalRepository extends Repository<ScoreApproval> {
  async findCountByIdScoreWithoutCreator(idScore: number): Promise<number> {
    return this.createQueryBuilder('sa')
      .innerJoin('sa.score', 's')
      .andWhere('sa.idScore = :idScore', { idScore })
      .andWhere('sa.actionByPlayer != s.createdByIdPlayer')
      .andWhere('sa.action = :action', { action: ScoreApprovalActionEnum.Approve })
      .getCount();
  }
}
