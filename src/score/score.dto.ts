import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { IsNumber } from '../validation/is-number';
import { ScorePlayerAddDto, ScorePlayerUpdateDto } from './score-player/score-player.dto';
import { Type } from 'class-transformer';
import { ScoreStatusEnum } from './score-status.enum';
import { IsArrayNumber } from '../validation/is-array-number';

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
  @IsEnum(ScoreStatusEnum)
  status?: ScoreStatusEnum;

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
  @IsArrayNumber()
  idPlatforms?: number[] | null | undefined;

  @IsOptional()
  @IsArrayNumber()
  idGames?: number[] | null | undefined;

  @IsOptional()
  @IsArrayNumber()
  idMiniGames?: number[] | null | undefined;

  @IsOptional()
  @IsArrayNumber()
  idModes?: number[] | null | undefined;

  @IsOptional()
  @IsArrayNumber()
  idStages?: number[] | null | undefined;

  @IsOptional()
  @IsArrayNumber()
  idCharacterCustomes?: number[] | null | undefined;
}
