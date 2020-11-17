import { IsDefined, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { IsNumber } from '../validation/is-number';

export class PlayerAddDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MinLength(3)
  personaName!: string;

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
}
