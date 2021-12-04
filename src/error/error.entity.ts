import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { Property } from '../mapper/property.decorator';
import { ErrorInterface } from './error.interface';
import { User } from '../user/user.entity';
import { SchemaEnum } from '../environment/schema.enum';

@Entity({ schema: SchemaEnum.main })
export class ErrorEntity extends BaseEntity implements ErrorInterface {
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
  @Column({ type: 'json', nullable: true })
  sqlParameters?: any[];

  @Property(() => User)
  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'createdBy' })
  createdByUser?: User;

  @Property()
  @Column({ nullable: true })
  url?: string;

  @Property()
  @Column({ type: 'json', nullable: true })
  body?: any;
}
