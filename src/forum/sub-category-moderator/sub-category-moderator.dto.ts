import { IsDefined } from 'class-validator';
import { IsArrayNumber } from '../../validation/is-array-number';

export class SubCategoryModeratorAddAndDeleteDto {
  @IsDefined()
  @IsArrayNumber()
  add!: number[];

  @IsDefined()
  @IsArrayNumber()
  delete!: number[];
}
