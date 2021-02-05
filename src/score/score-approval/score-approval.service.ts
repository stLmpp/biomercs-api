import { Injectable } from '@nestjs/common';
import { ScoreApprovalRepository } from './score-approval.repository';
import { ScoreApprovalAddAdminDto, ScoreApprovalAddPlayerDto } from './score-approval.dto';
import { ScoreApproval } from './score-approval.entity';

@Injectable()
export class ScoreApprovalService {
  constructor(private scoreApprovalRepository: ScoreApprovalRepository) {}

  async addAdmin({ idUser, ...dto }: ScoreApprovalAddAdminDto): Promise<ScoreApproval> {
    return this.scoreApprovalRepository.save(new ScoreApproval().extendDto({ ...dto, actionByAdmin: idUser }));
  }

  async addPlayer({ idPlayer, ...dto }: ScoreApprovalAddPlayerDto): Promise<ScoreApproval> {
    return this.scoreApprovalRepository.save(new ScoreApproval().extendDto({ ...dto, actionByPlayer: idPlayer }));
  }

  async findCountByIdScoreWithoutCreator(idScore: number): Promise<number> {
    return this.scoreApprovalRepository.findCountByIdScoreWithoutCreator(idScore);
  }
}
