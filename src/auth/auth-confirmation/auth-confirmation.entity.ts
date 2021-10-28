import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { User } from '../../user/user.entity';
import { Property } from '../../mapper/property.decorator';
import { SchemaEnum } from '../../environment/schema.enum';

@Entity({ schema: SchemaEnum.main })
export class AuthConfirmation extends BaseEntity {
  @Property()
  @Column()
  code!: number;

  @Property()
  @Column()
  expirationDate!: Date;

  @Property()
  @Column({ nullable: true })
  confirmationDate?: Date;

  @Property()
  @Column()
  idUser!: number;

  @Property(() => User)
  @ManyToOne(() => User, user => user.authConfirmations)
  @JoinColumn()
  user!: User;
}
