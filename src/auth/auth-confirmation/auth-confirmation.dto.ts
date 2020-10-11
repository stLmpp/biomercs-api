import { IsNumber } from '../../validation/is-number';
import { IsDefined } from 'class-validator';
import { IsDate } from '../../validation/is-date';

export class AuthConfirmationAddDto {
  @IsDefined()
  @IsNumber()
  idUser!: number;

  @IsDefined()
  @IsNumber()
  code!: number;

  @IsDefined()
  @IsDate()
  expirationDate!: Date;
}
