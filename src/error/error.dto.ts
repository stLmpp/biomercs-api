import { IsArray, IsDefined, IsOptional, IsString } from 'class-validator';

export class ErrorAddDto {
  @IsDefined()
  @IsString()
  name!: string;

  @IsDefined()
  @IsString()
  message!: string;

  @IsDefined()
  @IsString()
  stack!: string;

  @IsOptional()
  @IsString()
  sqlCode?: string;

  @IsOptional()
  @IsString()
  sqlHint?: string;

  @IsOptional()
  @IsString()
  sqlQuery?: string;

  @IsOptional()
  @IsArray()
  sqlParameters?: any[];

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  body?: any;
}
