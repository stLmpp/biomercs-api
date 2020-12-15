import { IsArray, IsDefined, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { IsNumber } from '../validation/is-number';
import { IsDate } from '../validation/is-date';
import { ScorePlayerAddDto } from './score-player/score-player.dto';
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

  @IsOptional()
  @IsDate()
  dateAchieved?: Date;

  @IsDefined()
  @IsArray()
  @Type(() => ScorePlayerAddDto)
  @ValidateNested({ each: true })
  scorePlayers!: ScorePlayerAddDto[];
}
