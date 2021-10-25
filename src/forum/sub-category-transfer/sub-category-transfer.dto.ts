import { IsDefined, IsNumber } from 'class-validator';

export class SubCategoryTransferAddDto {
  constructor(idSubCategory: number, idCategoryFrom: number, idCategoryTo: number) {
    this.idSubCategory = idSubCategory;
    this.idCategoryFrom = idCategoryFrom;
    this.idCategoryTo = idCategoryTo;
  }

  @IsDefined()
  @IsNumber()
  idSubCategory!: number;

  @IsDefined()
  @IsNumber()
  idCategoryFrom!: number;

  @IsDefined()
  @IsNumber()
  idCategoryTo!: number;
}
