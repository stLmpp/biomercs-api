import { Module } from '@nestjs/common';
import { ScoreApprovalService } from './score-approval.service';
import { ScoreApprovalController } from './score-approval.controller';
import { ScoreApprovalRepository } from './score-approval.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ScoreApprovalRepository])],
  providers: [ScoreApprovalService],
  controllers: [ScoreApprovalController],
  exports: [ScoreApprovalService],
})
export class ScoreApprovalModule {}
