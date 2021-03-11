import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { auditTime } from 'rxjs/operators';
import { ScoreWorldRecordRepository } from './score-world-record.repository';
import { ScoreWorldRecordScheduleService } from '../score-world-record-schedule/score-world-record-schedule.service';
import { ScoreWorldRecordScheduleAddDto } from '../score-world-record-schedule/score-world-record-schedule.dto';
import { ScoreWorldRecordSchedule } from '../score-world-record-schedule/score-world-record-schedule.entity';
import { ScoreService } from '../score.service';
import { ScoreWorldRecordTypeEnum } from './score-world-record-type.enum';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { IsNull } from 'typeorm';
import { ModeService } from '../../mode/mode.service';

@Injectable()
export class ScoreWorldRecordService {
  constructor(
    private scoreWorldRecordRepository: ScoreWorldRecordRepository,
    private scoreWorldRecordScheduleService: ScoreWorldRecordScheduleService,
    @Inject(forwardRef(() => ScoreService)) private scoreService: ScoreService,
    private modeService: ModeService
  ) {
    this._init().then();
  }

  private _runSchedules$ = new Subject<void>();

  @Transactional()
  private async _processSchedules(): Promise<void> {
    const schedules = await this.scoreWorldRecordScheduleService.findSchedules();
    const promises = schedules.map(schedule => this._processSchedule(schedule));
    await Promise.all(promises);
    await this.scoreWorldRecordScheduleService.deleteMany(schedules.map(schedule => schedule.id));
  }

  private async _init(): Promise<void> {
    this._runSchedules$.pipe(auditTime(15000)).subscribe(() => {
      this._processSchedules();
    });
    if (await this.scoreWorldRecordScheduleService.hasChecksScheduled()) {
      this._runSchedules$.next();
    }
  }

  private async _processSchedule({
    idPlatformGameMiniGameModeStage,
    idPlatformGameMiniGameModeCharacterCostumes,
    fromDate,
  }: ScoreWorldRecordSchedule): Promise<void> {
    const maxScore = await this.scoreService.findTopScoreByIdPlatformGameMiniGameModeStage(
      idPlatformGameMiniGameModeStage,
      fromDate
    );
    if (maxScore) {
      await this.scoreWorldRecordRepository.update(
        {
          idPlatformGameMiniGameModeStage,
          type: ScoreWorldRecordTypeEnum.WorldRecord,
          endDate: IsNull(),
        },
        { endDate: fromDate }
      );
      await this.scoreWorldRecordRepository.save({
        idScore: maxScore.id,
        idPlatformGameMiniGameModeStage,
        type: ScoreWorldRecordTypeEnum.WorldRecord,
      });
    }
    for (const idPlatformGameMiniGameModeCharacterCostume of idPlatformGameMiniGameModeCharacterCostumes) {
      const maxScoreCharacter = await this.scoreService.findTopScoreByIdPlatformGameMiniGameModeStageAndCharacterCostume(
        idPlatformGameMiniGameModeStage,
        idPlatformGameMiniGameModeCharacterCostume,
        fromDate
      );
      if (maxScoreCharacter) {
        await this.scoreWorldRecordRepository.updateEndDateCharacterWorldRecordByIdPlatformGameMiniGameModeStageAndCharacterCostume(
          idPlatformGameMiniGameModeStage,
          idPlatformGameMiniGameModeCharacterCostume,
          fromDate
        );
        await this.scoreWorldRecordRepository.save({
          idScore: maxScoreCharacter.id,
          idPlatformGameMiniGameModeStage,
          type: ScoreWorldRecordTypeEnum.CharacterWorldRecord,
          scoreWorldRecordCharacters: [{ idPlatformGameMiniGameModeCharacterCostume, createdBy: -1 }],
        });
      }
    }
    const mode = await this.modeService.findByIdPlatformGameMiniGameModeStage(idPlatformGameMiniGameModeStage);
    const playerQuantity = mode?.playerQuantity ?? 0;
    if (playerQuantity > 1) {
      const maxScoreCombination = await this.scoreService.findTopCombinationScoreByIdPlatformGameMiniGameModeStageAndCharacterCostumes(
        idPlatformGameMiniGameModeStage,
        idPlatformGameMiniGameModeCharacterCostumes,
        fromDate
      );
      if (maxScoreCombination) {
        await this.scoreWorldRecordRepository.updateEndDateCombinationWordRecordByIdPlatformGameMiniGameModeStageAndCharacterCostumes(
          idPlatformGameMiniGameModeStage,
          idPlatformGameMiniGameModeCharacterCostumes,
          fromDate
        );
        await this.scoreWorldRecordRepository.save({
          idScore: maxScoreCombination.id,
          idPlatformGameMiniGameModeStage: maxScoreCombination.idPlatformGameMiniGameModeStage,
          type: ScoreWorldRecordTypeEnum.CombinationWorldRecord,
          scoreWorldRecordCharacters: idPlatformGameMiniGameModeCharacterCostumes.map(
            idPlatformGameMiniGameModeCharacterCostume => ({ idPlatformGameMiniGameModeCharacterCostume })
          ),
        });
      }
    }
  }

  async scheduleWorldRecordSearch(dto: ScoreWorldRecordScheduleAddDto): Promise<void> {
    await this.scoreWorldRecordScheduleService.add(dto);
    this._runSchedules$.next();
  }
}
