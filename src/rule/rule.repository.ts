import { EntityRepository, Repository } from 'typeorm';
import { Rule } from './rule.entity';

@EntityRepository(Rule)
export class RuleRepository extends Repository<Rule> {}
