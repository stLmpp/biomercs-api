import { Module } from '@nestjs/common';
import { NotificationTypeService } from './notification-type.service';
import { NotificationTypeController } from './notification-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationTypeRepository } from './notification-type.repository';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationTypeRepository])],
  providers: [NotificationTypeService],
  controllers: [NotificationTypeController],
  exports: [NotificationTypeService],
})
export class NotificationTypeModule {}
