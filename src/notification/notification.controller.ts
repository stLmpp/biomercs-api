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

@ApiAuth()
@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(
    private notificationService: NotificationService,
    @InjectMapProfile(Notification, NotificationViewModel)
    private mapProfile: MapProfile<Notification, NotificationViewModel>
  ) {}

  @Get()
  async get(
    @AuthUser() user: User,
    @Query(Params.page) page: number,
    @Query(Params.limit) limit: number
  ): Promise<NotificationViewModel[]> {
    return this.mapProfile.mapPromise(this.notificationService.get(user.id, page, limit));
  }

  @Put('read-all')
  async readAll(@AuthUser() user: User): Promise<void> {
    await this.notificationService.readAll(user.id);
  }

  @Put(`${Params.idNotification}/read`)
  async read(@Param(Params.idNotification) idNotification: number): Promise<void> {
    await this.notificationService.read(idNotification);
  }
}
