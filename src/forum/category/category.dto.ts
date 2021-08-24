import { IsArray, IsDefined, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { IsNumber } from '../../validation/is-number';
import { SubCategoryUpsertDto } from '../sub-category/sub-category.dto';
import { Type } from 'class-transformer';
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

export class CategoryUpsertDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsDefined()
  @IsArray()
  @Type(() => SubCategoryUpsertDto)
  @ValidateNested({ each: true })
  subCategories!: SubCategoryUpsertDto[];

  @IsDefined()
  @IsBoolean()
  deleted!: boolean;

  @IsDefined()
  @IsBoolean()
  restored!: boolean;
}
