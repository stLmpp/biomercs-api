import { Property } from '../mapper/property.decorator';
import { refs } from '@nestjs/swagger';

export class NotificationExtraScore {
  @Property() idScore!: number;
  @Property() idScoreStatus!: number;

  static is(extra: NotificationExtra): extra is NotificationExtraScore {
    return !!(extra as NotificationExtraScore).idScore;
  }
}

export class NotificationExtraPost {
  @Property() idCategory!: number;
  @Property() idSubCategory!: number;
  @Property() pageSubCategory!: number;
  @Property() idTopic!: number;
  @Property() pageTopic!: number;
  @Property() idPost!: number;

  static is(extra: NotificationExtra): extra is NotificationExtraPost {
    return !!(extra as NotificationExtraPost).idPost;
  }
}

export type NotificationExtra = NotificationExtraScore | NotificationExtraPost;

export const notificationExtraRefs = refs(NotificationExtraScore, NotificationExtraPost);
