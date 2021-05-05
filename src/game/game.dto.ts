import { ArrayMinSize, IsDefined, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsArrayNumberQuery } from '../validation/is-array-number';

export class GameAddDto {
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

export class GameUpdateDto {
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

export class GamePlatformsDto {
  @IsDefined()
  @IsArrayNumberQuery()
  @ArrayMinSize(1)
  idPlatforms!: number[];
}
