import { IsBoolean, IsDefined, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthRegisterDto {
  @IsString()
  @IsDefined()
  @MinLength(3)
  username!: string;

  @IsString()
  @IsDefined()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsDefined()
  @IsEmail()
  email!: string;
}

export class AuthCredentialsDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  password!: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
