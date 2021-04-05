import { IsBoolean, IsDefined, IsNotEmpty, IsOptional, IsString, IsUrl, Min } from 'class-validator';
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

  @IsDefined()
  @IsNumber()
  @Min(0)
  bulletKills!: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  evidence!: string;
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
  @IsUrl()
  @IsNotEmpty()
  evidence?: string;
}
