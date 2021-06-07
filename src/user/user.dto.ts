import { IsBoolean, IsDefined, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsDate } from '../validation/is-date';
import { IsNumber } from '../validation/is-number';
import { IsArrayNumber } from '../validation/is-array-number';

export class UserAddDto {
  constructor(partial?: Partial<UserAddDto>) {
    Object.assign(this, partial);
  }

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  salt!: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsDate()
  lastOnline?: Date;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

export class UserUpdateDto {
  @IsOptional()
  @IsDate()
  lastOnline?: Date;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;

  @IsOptional()
  @IsNumber()
  idCurrentAuthConfirmation?: number | null;

  @IsOptional()
  @IsString()
  dateFormat?: string;
}

export class UserGetDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsArrayNumber()
  ids?: number[];

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
