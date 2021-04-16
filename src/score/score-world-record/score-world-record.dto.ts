import { ArrayNotEmpty, IsDefined, IsEnum, IsOptional } from 'class-validator';
import { IsNumber } from '../../validation/is-number';
import { IsArrayNumber } from '../../validation/is-array-number';
import { IsDate } from '../../validation/is-date';
import { ScoreWorldRecordTypeEnum } from './score-world-record-type.enum';

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

export class ScoreWorldRecordHistoryDto {
  @IsDefined()
  @IsNumber()
  idPlatform!: number;

  @IsDefined()
  @IsNumber()
  idGame!: number;

  @IsDefined()
  @IsNumber()
  idMiniGame!: number;

  @IsDefined()
  @IsNumber()
  idMode!: number;

  @IsDefined()
  @IsNumber()
  idStage!: number;

  @IsOptional()
  @IsNumber()
  idCharacterCostume?: number;

  @IsOptional()
  @IsDate()
  fromDate?: Date;

  @IsOptional()
  @IsDate()
  toDate?: Date;

  @IsOptional()
  @IsEnum(ScoreWorldRecordTypeEnum)
  type?: ScoreWorldRecordTypeEnum;
}
