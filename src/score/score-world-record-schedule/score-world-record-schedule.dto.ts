import { IsDefined } from 'class-validator';
import { IsDate } from '../../validation/is-date';
import { IsNumber } from '../../validation/is-number';
import { IsArrayNumber } from '../../validation/is-array-number';

export class ScoreWorldRecordScheduleAddDto {
  @IsDefined()
  @IsDate()
  fromDate!: Date;

  @IsDefined()
  @IsNumber()
  idPlatformGameMiniGameModeStage!: number;

  @IsDefined()
  @IsArrayNumber()
  idPlatformGameMiniGameModeCharacterCostumes!: number[];
}
