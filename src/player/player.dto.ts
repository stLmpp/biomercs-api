import { IsOptional, IsString, MaxLength } from 'class-validator';
import { IsNumber } from '../validation/is-number';

export class PlayerAddDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  personaName?: string;

  @IsNumber()
  @IsOptional()
  idUser?: number;

  @IsNumber()
  @IsOptional()
  idSteamProfile?: number;

  @IsString()
  @IsOptional()
  @MaxLength(250)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  aboutMe?: string;

  @IsOptional()
  @IsNumber()
  idRegion?: number;

  @IsOptional()
  @IsString()
  steamid?: string;
}

export class PlayerUpdateDto {
  @IsNumber()
  @IsOptional()
  idSteamProfile?: number;

  @IsString()
  @IsOptional()
  @MaxLength(250)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  aboutMe?: string;

  @IsOptional()
  @IsNumber()
  idRegion?: number;

  @IsOptional()
  @IsNumber()
  idInputType?: number;
}

export interface PlayerSearchDto {
  personaName: string;
  idUser: number;
  isAdmin: boolean;
  page: number;
  limit: number;
  idPlayersSelected: number[];
}
