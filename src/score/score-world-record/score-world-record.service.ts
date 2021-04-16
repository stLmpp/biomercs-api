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
        scoreWorldRecordCharacters: idPlatformGameMiniGameModeCharacterCostumes.map(
          idPlatformGameMiniGameModeCharacterCostume => ({ idPlatformGameMiniGameModeCharacterCostume })
        ),
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
          scoreWorldRecordCharacters: [{ idPlatformGameMiniGameModeCharacterCostume }],
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

  async findHistory(dto: ScoreWorldRecordHistoryDto): Promise<ScoreWorldRecord[]> {
    return this.scoreWorldRecordRepository.findHistory(dto);
  }
}
