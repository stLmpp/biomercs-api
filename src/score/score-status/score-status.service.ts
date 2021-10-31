import { Injectable } from '@nestjs/common';
import { ScoreStatusRepository } from './score-status.repository';
import { ScoreStatus } from './score-status.entity';
import { In } from 'typeorm';
import { ScoreStatusEnum } from './score-status.enum';

@Injectable()
export class ScoreStatusService {
  constructor(private scoreStatusRepository: ScoreStatusRepository) {}

  async findByIds(ids: ScoreStatusEnum[]): Promise<ScoreStatus[]> {
    return this.scoreStatusRepository.find({ where: { id: In(ids) }, order: { id: 'ASC' } });
  }

  async findOneOrFail(idScoreStatus: ScoreStatusEnum): Promise<ScoreStatus> {
    return this.scoreStatusRepository.findOneOrFail(idScoreStatus);
  }
}
