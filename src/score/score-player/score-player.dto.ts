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
  evidence!: string;
}
