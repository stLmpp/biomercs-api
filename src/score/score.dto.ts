import { IsArray, IsDefined, IsNotEmpty, IsString, MaxLength, ValidateNested } from 'class-validator';
import { IsNumber } from '../validation/is-number';
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

  @IsDefined()
  @IsArray()
  @Type(() => ScorePlayerAddDto)
  @ValidateNested({ each: true })
  scorePlayers!: ScorePlayerAddDto[];
}
