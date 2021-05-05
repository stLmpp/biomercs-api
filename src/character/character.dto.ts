import { ArrayMinSize, IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsArrayNumberQuery } from '../validation/is-array-number';

export class CharacterAddDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class CharacterUpdateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;
}

export class CharacterPlatformsGamesMiniGamesModesDto {
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
