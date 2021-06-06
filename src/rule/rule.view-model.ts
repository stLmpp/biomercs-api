import { Property } from '../mapper/property.decorator';
import { RuleInterface } from './rule.interface';

export class RuleViewModel implements RuleInterface {
  @Property() id!: number;
  @Property() description!: string;
  @Property() order!: number;
}
