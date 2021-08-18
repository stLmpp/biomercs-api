import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsNumber } from '../validation/is-number';

// TODO maybe create a new table with this messages? I don't know
export enum NotificationMessages {
  ScoreRejected = 'Your score was rejected!',
  ScoreApproved = 'Your score was approved!',
  AdminRequestedChangesToScore = 'The admin requested some changes to your score',
}

export class NotificationAddDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsDefined()
  @IsNumber()
  idUser!: number;

  @IsOptional()
  @IsNumber()
  idScore?: number;
}
