import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SchemaEnum } from '../environment/schema.enum';
import { BaseEntity } from '../shared/super/base-entity';
import { Property } from '../mapper/property.decorator';
import { User } from '../user/user.entity';
import { NotificationInterface } from './notification.interface';
import { NotificationType } from './notification-type/notification-type.entity';
import { NotificationExtra } from './notification-extra.view-model';

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
  @Column({ default: false })
  seen!: boolean;

  @Property()
  @Column({ type: 'json', nullable: true })
  extra?: NotificationExtra | null;

  @Property()
  @Column({ nullable: true })
  idNotificationType?: number | null;

  @Property(() => NotificationType)
  @ManyToOne(() => NotificationType, { nullable: true })
  @JoinColumn()
  notificationType?: NotificationType | null;

  @Property()
  @DeleteDateColumn()
  deletedDate?: Date | null;
}
