import { EntityRepository, Repository } from 'typeorm';
import { Stage } from './stage.entity';

@EntityRepository(Stage)
export class StageRepository extends Repository<Stage> {}
