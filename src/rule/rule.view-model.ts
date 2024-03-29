import { Property } from '../mapper/property.decorator';
import { RuleInterface } from './rule.interface';
import { RuleTypeEnum } from './rule-type.enum';

export class RuleViewModel implements RuleInterface {
  @Property() id!: number;
  @Property() description!: string;
  @Property() order!: number;
  @Property() type!: RuleTypeEnum;
}
