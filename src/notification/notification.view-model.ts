import { NotificationInterface } from './notification.interface';
import { Property } from '../mapper/property.decorator';

export class NotificationViewModel implements NotificationInterface {
  @Property() id!: number;
  @Property() content!: string;
  @Property() idUser!: number;
  @Property() read!: boolean;
  @Property() seen!: boolean;
  @Property() idScore?: number | null;
  @Property() idNotificationType?: number;
}
