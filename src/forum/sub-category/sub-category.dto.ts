import { IsDefined, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsNumber } from '../../validation/is-number';
import { IsBoolean } from '../../validation/is-boolean';

export class SubCategoryAddDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description!: string;

  @IsDefined()
  @IsNumber()
  idCategory!: number;
}

export class SubCategoryUpdateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsNumber()
  idCategory?: number;

  @IsDefined()
  @IsBoolean()
  deleted!: boolean;

  @IsDefined()
  @IsBoolean()
  restored!: boolean;
}

export class SubCategoryOrderDto {
  @IsDefined()
  @IsNumber()
  id!: number;

  @IsDefined()
  @IsNumber()
  order!: number;

  @IsOptional()
  @IsNumber()
  idCategory?: number;
}
