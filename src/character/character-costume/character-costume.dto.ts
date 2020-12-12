import { IsDefined, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CharacterCostumeAddDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  shortName!: string;
}

export class CharacterCostumeUpdateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  shortName?: string;
}
