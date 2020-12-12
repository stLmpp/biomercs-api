import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CharacterAddDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class CharacterUpdateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;
}
