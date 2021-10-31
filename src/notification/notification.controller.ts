import { Controller, Delete, Get, Param, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../auth/api-auth.decorator';
import { NotificationService } from './notification.service';
import { Params } from '../shared/type/params';
import { AuthUser } from '../auth/auth-user.decorator';
import { User } from '../user/user.entity';
import { NotificationViewModel } from './notification.view-model';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiPagination } from '../shared/decorator/api-pagination';

@ApiAuth()
@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @ApiPagination(NotificationViewModel)
  @Get()
  async get(
    @AuthUser() user: User,
    @Query(Params.page) page: number,
    @Query(Params.limit) limit: number
  ): Promise<Pagination<NotificationViewModel>> {
    return this.notificationService.findByIdUserPaginated(user.id, page, limit);
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

  @Delete('all')
  async deleteAll(@AuthUser() user: User): Promise<void> {
    await this.notificationService.deleteAll(user.id);
  }

  @Delete(`:${Params.idNotification}`)
  async delete(@Param(Params.idNotification) idNotifications: number): Promise<void> {
    await this.notificationService.delete(idNotifications);
  }
}
