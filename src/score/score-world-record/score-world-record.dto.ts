import { ArrayNotEmpty, IsDefined } from 'class-validator';
import { IsNumber } from '../../validation/is-number';
import { IsArrayNumber } from '../../validation/is-array-number';
import { IsDate } from '../../validation/is-date';

export class ScoreWorldRecordCheckDto {
  @IsDefined()
  @IsNumber()
  idPlatformGameMiniGameModeStage!: number;

  @IsDefined()
  @IsArrayNumber()
  @ArrayNotEmpty()
  idPlatformGameMiniGameModeCharacterCostumes!: number[];

  @IsDefined()
  @IsDate()
  fromDate!: Date;
}
