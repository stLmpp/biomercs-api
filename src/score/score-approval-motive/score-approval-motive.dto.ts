import { IsDefined, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ScoreApprovalActionEnum } from '../score-approval/score-approval-action.enum';

export class ScoreApprovalMotiveAddDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsDefined()
  @IsEnum(ScoreApprovalActionEnum)
  action!: ScoreApprovalActionEnum;
}

export class ScoreApprovalMotiveUpdateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsEnum(ScoreApprovalActionEnum)
  action?: ScoreApprovalActionEnum;
}
