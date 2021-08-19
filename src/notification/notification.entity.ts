import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SchemaEnum } from '../environment/schema.enum';
import { BaseEntity } from '../shared/super/base-entity';
import { Property } from '../mapper/property.decorator';
import { Score } from '../score/score.entity';
import { User } from '../user/user.entity';
import { NotificationInterface } from './notification.interface';
import { NotificationType } from './notification-type/notification-type.entity';

@Entity({ schema: SchemaEnum.main })
export class Notification extends BaseEntity implements NotificationInterface {
  @Property()
  @Column({ type: 'text' })
  content!: string;

  @Property()
  @Column()
  idUser!: number;

  @Property(() => User)
  @ManyToOne(() => User)
  @JoinColumn()
  user?: User;

  @Property()
  @Column({ default: false })
  read!: boolean;

  @Property()
  @Column({ nullable: true })
  idScore?: number | null;

  @Property(() => Score)
  @ManyToOne(() => Score, { nullable: true })
  @JoinColumn()
  score?: Score | null;

  @Property()
  @Column({ nullable: true })
  idNotificationType?: number | null;

  @Property(() => NotificationType)
  @ManyToOne(() => NotificationType, { nullable: true })
  @JoinColumn()
  notificationType?: NotificationType | null;
}
