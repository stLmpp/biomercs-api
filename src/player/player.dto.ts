import { IsOptional, IsString } from 'class-validator';
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

export interface PlayerSearchDto {
  personaName: string;
  idUser: number;
  isAdmin: boolean;
  page: number;
  limit: number;
  idPlayersSelected: number[];
}
