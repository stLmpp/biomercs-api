import { ArrayMinSize, IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsArrayNumberQuery } from '../validation/is-array-number';

export class MiniGameAddDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class MiniGameUpdateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;
}

export class MiniGamePlatformsGamesDto {
  @IsDefined()
  @IsArrayNumberQuery()
  @ArrayMinSize(1)
  idPlatforms!: number[];

  @IsDefined()
  @IsArrayNumberQuery()
  @ArrayMinSize(1)
  idGames!: number[];
}
