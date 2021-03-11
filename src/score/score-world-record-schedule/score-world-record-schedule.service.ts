import { Injectable } from '@nestjs/common';
import { ScoreWorldRecordScheduleRepository } from './score-world-record-schedule.repository';
import { ScoreWorldRecordSchedule } from './score-world-record-schedule.entity';
import { ScoreWorldRecordScheduleAddDto } from './score-world-record-schedule.dto';
import { isBefore } from 'date-fns';
import { SimpleArrayEquals } from '../../util/find-operator';
import { orderBy } from 'st-utils';

@Injectable()
export class ScoreWorldRecordScheduleService {
  constructor(private scoreWorldRecordScheduleRepository: ScoreWorldRecordScheduleRepository) {}

  private async _findScheduled(dto: ScoreWorldRecordScheduleAddDto): Promise<ScoreWorldRecordSchedule | undefined> {
    return this.scoreWorldRecordScheduleRepository.findOne({
      idPlatformGameMiniGameModeStage: dto.idPlatformGameMiniGameModeStage,
      idPlatformGameMiniGameModeCharacterCostumes: SimpleArrayEquals(dto.idPlatformGameMiniGameModeCharacterCostumes),
    });
  }

  async hasChecksScheduled(): Promise<boolean> {
    return this.scoreWorldRecordScheduleRepository.exists();
  }

  async findSchedules(): Promise<ScoreWorldRecordSchedule[]> {
    return this.scoreWorldRecordScheduleRepository.find();
  }

  async add(dto: ScoreWorldRecordScheduleAddDto): Promise<ScoreWorldRecordSchedule> {
    dto.idPlatformGameMiniGameModeCharacterCostumes = orderBy(dto.idPlatformGameMiniGameModeCharacterCostumes);
    const scoreWorldRecordSchedule = await this._findScheduled(dto);
    if (!scoreWorldRecordSchedule) {
      return this.scoreWorldRecordScheduleRepository.save(dto);
    } else if (isBefore(dto.fromDate, scoreWorldRecordSchedule.fromDate)) {
      await this.scoreWorldRecordScheduleRepository.update(scoreWorldRecordSchedule.id, { fromDate: dto.fromDate });
      scoreWorldRecordSchedule.fromDate = dto.fromDate;
    }
    return scoreWorldRecordSchedule;
  }

  async deleteMany(ids: number[]): Promise<void> {
    await this.scoreWorldRecordScheduleRepository.delete(ids);
  }
}
