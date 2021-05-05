import { ArrayMinSize, IsDefined, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsArrayNumberQuery } from '../validation/is-array-number';

export class StageAddDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  shortName!: string;
}

export class StageUpdateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  shortName?: string;
}

export class StagePlatformsGamesMiniGamesModesDto {
  @IsDefined()
  @IsArrayNumberQuery()
  @ArrayMinSize(1)
  idPlatforms!: number[];

  @IsDefined()
  @IsArrayNumberQuery()
  @ArrayMinSize(1)
  idGames!: number[];

  @IsDefined()
  @IsArrayNumberQuery()
  @ArrayMinSize(1)
  idMiniGames!: number[];

  @IsDefined()
  @IsArrayNumberQuery()
  @ArrayMinSize(1)
  idModes!: number[];
}
