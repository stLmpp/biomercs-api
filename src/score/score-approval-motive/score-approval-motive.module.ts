import { Module } from '@nestjs/common';
import { ScoreApprovalMotiveService } from './score-approval-motive.service';
import { ScoreApprovalMotiveController } from './score-approval-motive.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreApprovalMotiveRepository } from './score-approval-motive.repository';
import { MapperModule } from '../../mapper/mapper.module';
import { EnvironmentModule } from '../../environment/environment.module';

@Module({
  imports: [TypeOrmModule.forFeature([ScoreApprovalMotiveRepository]), MapperModule, EnvironmentModule],
  providers: [ScoreApprovalMotiveService],
  controllers: [ScoreApprovalMotiveController],
  exports: [ScoreApprovalMotiveService],
})
export class ScoreApprovalMotiveModule {}
