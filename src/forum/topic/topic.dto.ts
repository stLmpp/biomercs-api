import { IsDefined, IsString, MaxLength } from 'class-validator';

export class TopicAddDto {
  @IsDefined()
  @IsString()
  @MaxLength(150)
  name!: string;

  @IsDefined()
  @IsString()
  content!: string;
}
