import { IsDefined, IsEmail, IsString, MaxLength } from 'class-validator';

export class ContactSendMailDto {
  @IsDefined()
  @IsString()
  @MaxLength(200)
  subject!: string;

  @IsDefined()
  @IsString()
  @MaxLength(2000)
  body!: string;

  @IsDefined()
  @IsString()
  @IsEmail()
  from!: string;
}
