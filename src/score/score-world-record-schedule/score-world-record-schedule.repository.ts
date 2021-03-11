import { EntityRepository, Repository } from 'typeorm';
import { ScoreWorldRecordSchedule } from './score-world-record-schedule.entity';

@EntityRepository(ScoreWorldRecordSchedule)
export class ScoreWorldRecordScheduleRepository extends Repository<ScoreWorldRecordSchedule> {}
