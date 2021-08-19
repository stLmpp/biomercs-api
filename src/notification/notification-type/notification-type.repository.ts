import { EntityRepository, Repository } from 'typeorm';
import { NotificationType } from './notification-type.entity';

@EntityRepository(NotificationType)
export class NotificationTypeRepository extends Repository<NotificationType> {}
