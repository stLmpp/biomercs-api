import { IsDefined, IsObject, IsOptional, IsString } from 'class-validator';
import { IsNumber } from '../validation/is-number';
import { NotificationExtra } from './notification-extra.view-model';

export class NotificationAddDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsDefined()
  @IsNumber()
  idUser!: number;

  @IsOptional()
  @IsNumber()
  idNotificationType?: number;

  @IsOptional()
  @IsObject()
  extra?: NotificationExtra;
}
