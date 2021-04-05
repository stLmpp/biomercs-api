import { Injectable } from '@nestjs/common';
import { ScoreChangeRequestRepository } from './score-change-request.repository';
import { ScoreChangeRequest } from './score-change-request.entity';
import { IsNull } from 'typeorm';

@Injectable()
export class ScoreChangeRequestService {
  constructor(private scoreChangeRequestRepository: ScoreChangeRequestRepository) {}

  async addMany(idScore: number, dtos: string[]): Promise<ScoreChangeRequest[]> {
    return this.scoreChangeRequestRepository.save(
      dtos.map(description => new ScoreChangeRequest().extendDto({ description, idScore }))
    );
  }

  async fulfilMany(idsScoreChangeRequest: number[]): Promise<void> {
    await this.scoreChangeRequestRepository.update(idsScoreChangeRequest, { dateFulfilled: new Date() });
  }

  async hasAnyRequestChanges(idScore: number): Promise<boolean> {
    return this.scoreChangeRequestRepository.exists({ idScore, dateFulfilled: IsNull() });
  }
}
