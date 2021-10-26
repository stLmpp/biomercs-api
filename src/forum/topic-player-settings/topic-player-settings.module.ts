import { Module } from '@nestjs/common';
import { TopicPlayerSettingsService } from './topic-player-settings.service';
import { TopicPlayerSettingsController } from './topic-player-settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicPlayerSettingsRepository } from './topic-player-settings.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TopicPlayerSettingsRepository])],
  providers: [TopicPlayerSettingsService],
  controllers: [TopicPlayerSettingsController],
  exports: [TopicPlayerSettingsService],
})
export class TopicPlayerSettingsModule {}
