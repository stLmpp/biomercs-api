import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsNumber } from '../validation/is-number';
import { IsBoolean } from '../validation/is-boolean';

export class RuleAddDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsDefined()
  @IsNumber()
  order!: number;
}

export class RuleUpdateDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class RuleUpsertDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsDefined()
  @IsNumber()
  order!: number;

  @IsDefined()
  @IsBoolean()
  deleted!: boolean;
}
