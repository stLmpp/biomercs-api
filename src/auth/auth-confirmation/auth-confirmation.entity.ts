import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { User } from '../../user/user.entity';
import { Property } from '../../mapper/property.decorator';

@Entity()
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
  @ManyToOne(() => User)
  @JoinColumn()
  user!: User;
}
