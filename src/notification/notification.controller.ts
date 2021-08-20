import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../auth/api-auth.decorator';
import { NotificationService } from './notification.service';
import { Notification } from './notification.entity';
import { Params } from '../shared/type/params';
import { AuthUser } from '../auth/auth-user.decorator';
import { User } from '../user/user.entity';
import { InjectMapProfile } from '../mapper/inject-map-profile';
import { NotificationViewModel } from './notification.view-model';
import { MapProfile } from '../mapper/map-profile';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiPagination } from '../shared/decorator/api-pagination';

@ApiAuth()
@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(
    private notificationService: NotificationService,
    @InjectMapProfile(Notification, NotificationViewModel)
    private mapProfile: MapProfile<Notification, NotificationViewModel>
  ) {}

  @ApiPagination(NotificationViewModel)
  @Get()
  async get(
    @AuthUser() user: User,
    @Query(Params.page) page: number,
    @Query(Params.limit) limit: number
  ): Promise<Pagination<NotificationViewModel>> {
    const { meta, items } = await this.notificationService.get(user.id, page, limit);
    return { meta, items: this.mapProfile.map(items) };
  }

  @Get('unread-count')
  async unreadCount(@AuthUser() user: User): Promise<number> {
    return this.notificationService.unreadCount(user.id);
  }

  @Get('unseen-count')
  async unseenCount(@AuthUser() user: User): Promise<number> {
    return this.notificationService.unseenCount(user.id);
  }

  @Put('read-all')
  async readAll(@AuthUser() user: User): Promise<number> {
    return this.notificationService.readAll(user.id);
  }

  @Put('seen-all')
  async seenAll(@AuthUser() user: User): Promise<void> {
    return this.notificationService.seenAll(user.id);
  }

  @Put(`:${Params.idNotification}/read`)
  async read(@Param(Params.idNotification) idNotification: number): Promise<number> {
    return this.notificationService.read(idNotification);
  }

  @Put(`:${Params.idNotification}/unread`)
  async unread(@Param(Params.idNotification) idNotification: number): Promise<void> {
    await this.notificationService.unread(idNotification);
  }
}
