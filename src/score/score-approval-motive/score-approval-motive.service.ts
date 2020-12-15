import { Injectable } from '@nestjs/common';
import { ScoreApprovalMotiveRepository } from './score-approval-motive.repository';
import { ScoreApprovalMotiveAddDto, ScoreApprovalMotiveUpdateDto } from './score-approval-motive.dto';
import { ScoreApprovalMotive } from './score-approval-motive.entity';
import { ScoreApprovalActionEnum } from '../score-approval/score-approval-action.enum';

@Injectable()
export class ScoreApprovalMotiveService {
  constructor(private scoreApprovalMotiveRepository: ScoreApprovalMotiveRepository) {}

  async add(dto: ScoreApprovalMotiveAddDto): Promise<ScoreApprovalMotive> {
    return this.scoreApprovalMotiveRepository.save(new ScoreApprovalMotive().extendDto(dto));
  }

  async update(idScoreApprovalMotive: number, dto: ScoreApprovalMotiveUpdateDto): Promise<ScoreApprovalMotive> {
    const scoreApprovalMotive = await this.scoreApprovalMotiveRepository.findOneOrFail(idScoreApprovalMotive);
    await this.scoreApprovalMotiveRepository.update(idScoreApprovalMotive, dto);
    return new ScoreApprovalMotive().extendDto({ ...scoreApprovalMotive, ...dto });
  }

  async findByAction(action: ScoreApprovalActionEnum): Promise<ScoreApprovalMotive[]> {
    return this.scoreApprovalMotiveRepository.find({ where: { action } });
  }
}
