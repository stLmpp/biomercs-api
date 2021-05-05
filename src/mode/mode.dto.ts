import { ArrayMinSize, IsDefined, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { IsNumber } from '../validation/is-number';
import { IsArrayNumberQuery } from '../validation/is-array-number';

export class ModeAddDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsDefined()
  @IsNumber()
  @Min(1)
  playerQuantity!: number;
}

export class ModeUpdateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;
}

export class ModePlatformsGamesMiniGamesDto {
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
}
