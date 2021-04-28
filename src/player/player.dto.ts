import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { IsNumber } from '../validation/is-number';

export class PlayerAddDto {
  @IsOptional()
  @IsString()
  personaName?: string;

  @IsNumber()
  @IsOptional()
  idUser?: number;

  @IsNumber()
  @IsOptional()
  idSteamProfile?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  aboutMe?: string;

  @IsOptional()
  @IsNumber()
  idRegion?: number;

  @IsOptional()
  @IsString()
  steamid?: string;
}

export class PlayerUpdateDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(3)
  personaName?: string;

  @IsNumber()
  @IsOptional()
  idUser?: number;

  @IsNumber()
  @IsOptional()
  idSteamProfile?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  aboutMe?: string;

  @IsOptional()
  @IsNumber()
  idRegion?: number;
}
