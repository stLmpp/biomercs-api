import { IsObject, IsOptional, IsString, MaxLength } from 'class-validator';
import { PostContent } from './post-content.view-model';

export class PostUpdateDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  name?: string;

  @IsOptional()
  @IsObject()
  content?: PostContent;
}
