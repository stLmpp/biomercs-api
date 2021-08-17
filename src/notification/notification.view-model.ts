import { NotificationInterface } from './notification.interface';
import { Property } from '../mapper/property.decorator';

export class NotificationViewModel implements NotificationInterface {
  @Property() content!: string;
  @Property() idUser!: number;
  @Property() read!: boolean;
  @Property() idScore?: number | null;
  @Property() scoreName?: string | null;
}
