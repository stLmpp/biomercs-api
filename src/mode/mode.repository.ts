import { EntityRepository, Repository } from 'typeorm';
import { Mode } from './mode.entity';

@EntityRepository(Mode)
export class ModeRepository extends Repository<Mode> {}
