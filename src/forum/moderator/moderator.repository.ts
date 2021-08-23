import { EntityRepository, Repository } from 'typeorm';
import { Moderator } from './moderator.entity';

@EntityRepository(Moderator)
export class ModeratorRepository extends Repository<Moderator> {}
