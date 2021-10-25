import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { RuleInterface } from './rule.interface';
import { Property } from '../mapper/property.decorator';
import { SchemaEnum } from '../environment/schema.enum';
import { RuleTypeEnum } from './rule-type.enum';

@Entity({ schema: SchemaEnum.main, orderBy: { order: 'ASC' } })
export class Rule extends BaseEntity implements RuleInterface {
  @Property()
  @Column()
  description!: string;

  @Property()
  @Column()
  order!: number;

  @Property()
  @Column({ type: 'enum', enum: RuleTypeEnum })
  type!: RuleTypeEnum;
}
