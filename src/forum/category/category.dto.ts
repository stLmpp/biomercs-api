import { IsDefined, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsBoolean } from '../../validation/is-boolean';

export class CategoryAddDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;
}

export class CategoryUpdateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string;

  @IsDefined()
  @IsBoolean()
  deleted!: boolean;

  @IsDefined()
  @IsBoolean()
  restored!: boolean;
}
