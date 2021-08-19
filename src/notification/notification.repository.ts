import { EntityRepository, Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { includeAllScoresRelations } from '../score/shared';

@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {
  findOneWithAllRelations(idNotification: number): Promise<Notification> {
    return includeAllScoresRelations(
      this.createQueryBuilder('notification')
        .leftJoinAndSelect('notification.score', 'score')
        .andWhere('notification.id = :idNotification', { idNotification })
        .orderBy('notification.creationDate', 'DESC'),
      true
    ).getOneOrFail();
  }

  findPaginated(idUser: number, page: number, limit: number): Promise<Pagination<Notification>> {
    return includeAllScoresRelations(
      this.createQueryBuilder('notification')
        .leftJoinAndSelect('notification.score', 'score')
        .andWhere('notification.idUser = :idUser', { idUser })
        .orderBy('notification.creationDate', 'DESC'),
      true
    ).paginate(page, limit);
  }

  findIdsWithAllRelations(idNotifications: number[]): Promise<Notification[]> {
    return includeAllScoresRelations(
      this.createQueryBuilder('notification')
        .leftJoinAndSelect('notification.score', 'score')
        .andWhere('notification.id in (:...idNotifications)', { idNotifications })
        .orderBy('notification.creationDate', 'DESC'),
      true
    ).getMany();
  }
}
