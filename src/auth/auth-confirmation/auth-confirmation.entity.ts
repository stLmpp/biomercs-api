import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/super/base-entity';
import { User } from '../../user/user.entity';

@Entity()
export class AuthConfirmation extends BaseEntity {
  @Column()
  code!: number;

  @Column()
  expirationDate!: Date;

  @Column()
  idUser!: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user!: User;
}
