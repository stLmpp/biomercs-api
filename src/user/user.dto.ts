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

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  displayName?: string;

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
  @IsString()
  @IsNotEmpty()
  displayName?: string;

  @IsOptional()
  @IsDate()
  lastOnline?: Date;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
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
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
