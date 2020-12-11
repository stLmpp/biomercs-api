import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MiniGameAddDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class MiniGameUpdateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;
}
