import { Injectable } from '@nestjs/common';
import { ScoreChangeRequestRepository } from './score-change-request.repository';
import { ScoreChangeRequest } from './score-change-request.entity';

@Injectable()
export class ScoreChangeRequestService {
  constructor(private scoreChangeRequestRepository: ScoreChangeRequestRepository) {}

  async addMany(idScore: number, dtos: string[]): Promise<ScoreChangeRequest[]> {
    return this.scoreChangeRequestRepository.save(
      dtos.map(description => new ScoreChangeRequest().extendDto({ description, idScore }))
    );
  }
}
