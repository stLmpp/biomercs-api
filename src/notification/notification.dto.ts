import { IsDefined, IsOptional, IsString } from 'class-validator';
import { IsNumber } from '../validation/is-number';

export class NotificationAddDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsDefined()
  @IsNumber()
  idUser!: number;

  @IsOptional()
  @IsNumber()
  idScore?: number;

  @IsOptional()
  @IsNumber()
  idNotificationType?: number;
}
