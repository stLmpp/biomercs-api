import { IsDefined, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsNumber } from '../../validation/is-number';

export class PostUpdateDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  name?: string;

  @IsOptional()
  @IsString()
  content?: string;
}

export class PostAddDto {
  @IsDefined()
  @IsString()
  @MaxLength(500)
  name!: string;

  @IsDefined()
  @IsString()
  content!: string;

  @IsDefined()
  @IsNumber()
  idTopic!: number;
}
