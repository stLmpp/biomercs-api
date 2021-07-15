import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { Property } from '../mapper/property.decorator';

@Entity()
export class ErrorEntity extends BaseEntity {
  @Property()
  @Column()
  name!: string;

  @Property()
  @Column()
  message!: string;

  @Property()
  @Column({ type: 'text' })
  stack!: string;

  @Property()
  @Column({ nullable: true })
  sqlCode?: string;

  @Property()
  @Column({ nullable: true })
  sqlHint?: string;

  @Property()
  @Column({ type: 'text', nullable: true })
  sqlQuery?: string;

  @Property()
  @Column({ type: 'varchar', array: true, nullable: true })
  sqlParameters?: string[];
}
