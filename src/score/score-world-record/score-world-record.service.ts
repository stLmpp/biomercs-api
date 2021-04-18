import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ScoreWorldRecordRepository } from './score-world-record.repository';
import { ScoreService } from '../score.service';
import { ScoreWorldRecordTypeEnum } from './score-world-record-type.enum';
import { IsNull } from 'typeorm';
import { ModeService } from '../../mode/mode.service';
import { ScoreWorldRecordCheckDto, ScoreWorldRecordHistoryDto } from './score-world-record.dto';
import { ScoreWorldRecord } from './score-world-record.entity';

@Injectable()
export class ScoreWorldRecordService {
  constructor(
    private scoreWorldRecordRepository: ScoreWorldRecordRepository,
    @Inject(forwardRef(() => ScoreService)) private scoreService: ScoreService,
    private modeService: ModeService
  ) {}

  async checkForWorldRecord({
    idPlatformGameMiniGameModeCharacterCostumes,
    idPlatformGameMiniGameModeStage,
    fromDate,
  }: ScoreWorldRecordCheckDto): Promise<void> {
    const [maxScore, currentWorldRecord] = await Promise.all([
      this.scoreService.findTopScoreByIdPlatformGameMiniGameModeStage(idPlatformGameMiniGameModeStage, fromDate),
      this.scoreWorldRecordRepository.findOne({
        where: { type: ScoreWorldRecordTypeEnum.WorldRecord, idPlatformGameMiniGameModeStage, endDate: IsNull() },
      }),
    ]);
    if (maxScore && maxScore.id !== currentWorldRecord?.idScore) {
      if (currentWorldRecord) {
        await this.scoreWorldRecordRepository.update(currentWorldRecord.id, { endDate: fromDate });
      }
      await this.scoreWorldRecordRepository.save({
        idScore: maxScore.id,
        idPlatformGameMiniGameModeStage,
        type: ScoreWorldRecordTypeEnum.WorldRecord,
        scoreWorldRecordCharacters: idPlatformGameMiniGameModeCharacterCostumes.map(
          idPlatformGameMiniGameModeCharacterCostume => ({ idPlatformGameMiniGameModeCharacterCostume })
        ),
      });
    }
    for (const idPlatformGameMiniGameModeCharacterCostume of idPlatformGameMiniGameModeCharacterCostumes) {
      const [maxScoreCharacter, currentCharacterWorldRecord] = await Promise.all([
        this.scoreService.findTopScoreByIdPlatformGameMiniGameModeStageAndCharacterCostume(
          idPlatformGameMiniGameModeStage,
          idPlatformGameMiniGameModeCharacterCostume,
          fromDate
        ),
        this.scoreWorldRecordRepository.findCharacterWorldRecordByIdPlatformGameMiniGameModeStageAndCharacterCostume(
          idPlatformGameMiniGameModeStage,
          idPlatformGameMiniGameModeCharacterCostume
        ),
      ]);
      if (maxScoreCharacter && maxScoreCharacter.id !== currentCharacterWorldRecord?.idScore) {
        if (currentCharacterWorldRecord) {
          await this.scoreWorldRecordRepository.update(currentCharacterWorldRecord.id, { endDate: fromDate });
        }
        await this.scoreWorldRecordRepository.save({
          idScore: maxScoreCharacter.id,
          idPlatformGameMiniGameModeStage,
          type: ScoreWorldRecordTypeEnum.CharacterWorldRecord,
          scoreWorldRecordCharacters: [{ idPlatformGameMiniGameModeCharacterCostume }],
        });
      }
    }
    const mode = await this.modeService.findByIdPlatformGameMiniGameModeStage(idPlatformGameMiniGameModeStage);
    const playerQuantity = mode?.playerQuantity ?? 0;
    if (playerQuantity > 1) {
      const [maxScoreCombination, currentCombinationWorldRecord] = await Promise.all([
        this.scoreService.findTopCombinationScoreByIdPlatformGameMiniGameModeStageAndCharacterCostumes(
          idPlatformGameMiniGameModeStage,
          idPlatformGameMiniGameModeCharacterCostumes,
          fromDate
        ),
        this.scoreWorldRecordRepository.findCombinationWordRecordByIdPlatformGameMiniGameModeStageAndCharacterCostumes(
          idPlatformGameMiniGameModeStage,
          idPlatformGameMiniGameModeCharacterCostumes
        ),
      ]);
      if (maxScoreCombination && maxScoreCombination.id !== currentCombinationWorldRecord?.idScore) {
        if (currentCombinationWorldRecord) {
          await this.scoreWorldRecordRepository.update(currentCombinationWorldRecord.id, { endDate: fromDate });
        }
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

  async findHistory(dto: ScoreWorldRecordHistoryDto): Promise<ScoreWorldRecord[]> {
    return this.scoreWorldRecordRepository.findHistory(dto);
  }
}
