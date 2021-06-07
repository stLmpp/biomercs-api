import { TextEncodingEnum } from './text-encoding.enum';
import { IsDefined, IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { IsDate } from '../validation/is-date';

export class MailSendDto {
  @IsDefined()
  @IsString()
  template!: string;

  @IsDefined()
  @IsObject()
  context!: Record<any, any>;

  @IsDefined()
  @IsString()
  from!: string;

  @IsDefined()
  to!: string[] | string;

  @IsOptional()
  cc?: string[] | string;

  @IsOptional()
  bcc?: string[] | string;

  @IsOptional()
  @IsString()
  replyTo?: string;

  @IsOptional()
  @IsString()
  inReplyTo?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  html?: string;

  @IsOptional()
  @IsString()
  sender?: string;

  @IsOptional()
  @IsString()
  raw?: string;

  @IsOptional()
  @IsEnum(TextEncodingEnum)
  textEncoding?: TextEncodingEnum;

  @IsOptional()
  @IsString()
  references?: string;

  @IsOptional()
  @IsString()
  encoding?: string;

  @IsOptional()
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsString()
  transporterName?: string;
}
