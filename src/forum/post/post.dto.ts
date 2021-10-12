import { IsOptional, IsString, MaxLength } from 'class-validator';

export class PostUpdateDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  name?: string;

  @IsOptional()
  @IsString()
  content?: string;
}
