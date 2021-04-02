import { Module } from '@nestjs/common';
import { ScoreChangeRequestService } from './score-change-request.service';
import { ScoreChangeRequestController } from './score-change-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreChangeRequestRepository } from './score-change-request.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ScoreChangeRequestRepository])],
  providers: [ScoreChangeRequestService],
  controllers: [ScoreChangeRequestController],
  exports: [ScoreChangeRequestService],
})
export class ScoreChangeRequestModule {}
