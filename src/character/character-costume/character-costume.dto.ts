import { IsDefined, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsNumber } from '../../validation/is-number';

export class CharacterCostumeAddDto {
  @IsDefined()
  @IsNumber()
  idCharacter!: number;

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
