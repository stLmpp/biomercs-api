import { IsBoolean, IsDefined, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { IsNumber } from '../../validation/is-number';

export class ScorePlayerAddDto {
  constructor(partial?: Partial<ScorePlayerAddDto>) {
    Object.assign(this, partial);
  }

  @IsDefined()
  @IsNumber()
  idPlayer!: number;

  @IsDefined()
  @IsNumber()
  idCharacterCostume!: number;

  @IsOptional()
  @IsBoolean()
  host?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bulletKills?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  evidence!: string;

  @IsOptional()
  @IsNumber()
  idPlatformInputType?: number;
}

export class ScorePlayerUpdateDto {
  @IsDefined()
  @IsNumber()
  id!: number;

  @IsOptional()
  @IsBoolean()
  host?: boolean;

  @IsOptional()
  @IsNumber()
  bulletKills?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  evidence?: string;

  @IsOptional()
  @IsNumber()
  idCharacterCostume?: number;

  @IsOptional()
  @IsNumber()
  idPlatformInputType?: number;

  @IsOptional()
  @IsNumber()
  idPlatformGameMiniGameModeCharacterCostume?: number;
}
