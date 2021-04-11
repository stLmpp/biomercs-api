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
  @IsOptional()
  @IsString()
  score?: string | null | undefined;

  @IsOptional()
  @IsString()
  platform?: string | null | undefined;

  @IsOptional()
  @IsString()
  game?: string | null | undefined;

  @IsOptional()
  @IsString()
  miniGame?: string | null | undefined;

  @IsOptional()
  @IsString()
  mode?: string | null | undefined;

  @IsOptional()
  @IsString()
  stage?: string | null | undefined;

  @IsOptional()
  @IsString()
  character?: string | null | undefined;

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
  player?: string | null | undefined;

  @IsDefined()
  @IsEnum(ScoreStatusEnum)
  status!: ScoreStatusEnum;
}
