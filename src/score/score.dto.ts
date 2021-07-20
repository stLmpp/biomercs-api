import { IsArray, IsDefined, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { IsNumber } from '../validation/is-number';
import { ScorePlayerAddDto, ScorePlayerUpdateDto } from './score-player/score-player.dto';
import { Type } from 'class-transformer';
import { IsArrayNumberQuery } from '../validation/is-array-number';
import { IsBoolean } from '../validation/is-boolean';
import { ScoreStatusEnum } from './score-status/score-status.enum';
import { IsDate } from '../validation/is-date';

export class ScoreAddDto {
  @IsNumber()
  @IsDefined()
  idPlatform!: number;

  @IsNumber()
  @IsDefined()
  idGame!: number;

  @IsNumber()
  @IsDefined()
  idMiniGame!: number;

  @IsNumber()
  @IsDefined()
  idMode!: number;

  @IsNumber()
  @IsDefined()
  idStage!: number;

  @IsNumber()
  @IsDefined()
  score!: number;

  @IsNumber()
  @IsDefined()
  maxCombo!: number;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(8)
  time!: string;

  @IsDefined()
  @IsArray()
  @Type(() => ScorePlayerAddDto)
  @ValidateNested({ each: true })
  scorePlayers!: ScorePlayerAddDto[];

  @IsOptional()
  @IsDate()
  achievedDate?: Date;
}

export class ScoreChangeRequestsFulfilDto {
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(8)
  @IsString()
  time?: string;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsNumber()
  maxCombo?: number;

  @IsOptional()
  @IsArray()
  @Type(() => ScorePlayerUpdateDto)
  @ValidateNested({ each: true })
  scorePlayers?: ScorePlayerUpdateDto[];

  @IsDefined()
  @IsArray()
  idsScoreChangeRequests!: number[];
}

export class ScoreSearchDto {
  @IsDefined()
  @IsNumber()
  page!: number;

  @IsDefined()
  @IsNumber()
  limit!: number;

  @IsOptional()
  @IsNumber()
  idScoreStatus?: ScoreStatusEnum;

  @IsOptional()
  @IsBoolean()
  worldRecord?: boolean | null | undefined;

  @IsOptional()
  @IsBoolean()
  characterWorldRecord?: boolean | null | undefined;

  @IsOptional()
  @IsBoolean()
  combinationWorldRecord?: boolean | null | undefined;

  @IsOptional()
  @IsString()
  score?: string | null | undefined;

  @IsOptional()
  @IsArrayNumberQuery()
  idPlatforms?: number[] | null | undefined;

  @IsOptional()
  @IsArrayNumberQuery()
  idGames?: number[] | null | undefined;

  @IsOptional()
  @IsArrayNumberQuery()
  idMiniGames?: number[] | null | undefined;

  @IsOptional()
  @IsArrayNumberQuery()
  idModes?: number[] | null | undefined;

  @IsOptional()
  @IsArrayNumberQuery()
  idStages?: number[] | null | undefined;

  @IsOptional()
  @IsArrayNumberQuery()
  idCharacterCostumes?: number[] | null | undefined;

  @IsOptional()
  @IsBoolean()
  onlyMyScores?: boolean;
}
