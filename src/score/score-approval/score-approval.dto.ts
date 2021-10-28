import { IsDefined, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ScoreApprovalActionEnum } from './score-approval-action.enum';
import { IsNumber } from '../../validation/is-number';
import { IsDate } from '../../validation/is-date';

export class ScoreApprovalAddDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description!: string;

  @IsNumber()
  @IsDefined()
  idScoreApprovalMotive!: number;
}

export class ScoreApprovalAddAdminDto extends ScoreApprovalAddDto {
  @IsDefined()
  @IsNumber()
  idUser!: number;

  @IsDefined()
  @IsEnum(ScoreApprovalActionEnum)
  action!: ScoreApprovalActionEnum;

  @IsDefined()
  @IsDate()
  actionDate!: Date;

  @IsNumber()
  @IsDefined()
  idScore!: number;
}
