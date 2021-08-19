import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationRepository } from './notification.repository';
import { MapperModule } from '../mapper/mapper.module';
import { NotificationGateway } from './notification.gateway';
import { NotificationTypeModule } from './notification-type/notification-type.module';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationRepository]), MapperModule, NotificationTypeModule],
  providers: [NotificationService, NotificationGateway],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
