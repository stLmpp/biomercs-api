import { IsArray, IsDefined, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { IsNumber } from '../validation/is-number';
import { ScorePlayerAddDto, ScorePlayerUpdateDto } from './score-player/score-player.dto';
import { Type } from 'class-transformer';

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
