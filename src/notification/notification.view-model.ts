import { NotificationInterface } from './notification.interface';
import { Property } from '../mapper/property.decorator';
import {
  NotificationExtra,
  NotificationExtraPost,
  notificationExtraRefs,
  NotificationExtraScore,
} from './notification-extra.view-model';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels(NotificationExtraPost, NotificationExtraScore)
export class NotificationViewModel implements NotificationInterface {
  @Property() id!: number;
  @Property() content!: string;
  @Property() idUser!: number;
  @Property() read!: boolean;
  @Property() seen!: boolean;
  @Property() idScore?: number | null;
  @Property() idScoreStatus?: number | null;
  @Property() idNotificationType?: number | null;

  @ApiProperty({ oneOf: notificationExtraRefs })
  @Property()
  extra?: NotificationExtra | null;
}
