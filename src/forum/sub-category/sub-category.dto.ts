import { IsDefined, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsNumber } from '../../validation/is-number';
import { IsBoolean } from '../../validation/is-boolean';
import { OmitType } from '@nestjs/swagger';

export class SubCategoryUpsertDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  description!: string;

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

export class SubCategoryUpsertWithCategoryDto extends OmitType<SubCategoryUpsertDto, 'idCategory'>(
  SubCategoryUpsertDto,
  ['idCategory']
) {
  constructor(partial?: Partial<SubCategoryUpsertWithCategoryDto>) {
    super();
    Object.assign(this, partial);
  }

  @IsDefined()
  @IsNumber()
  idCategory!: number;
}
