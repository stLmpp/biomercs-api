import { Injectable } from '@nestjs/common';
import { TopicPlayerSettingsRepository } from './topic-player-settings.repository';

@Injectable()
export class TopicPlayerSettingsService {
  constructor(private topicPlayerSettingsRepository: TopicPlayerSettingsRepository) {}

  async upsert(idTopic: number, idPlayer: number, notifications: boolean): Promise<void> {
    const id = await this.topicPlayerSettingsRepository
      .findOne({ where: { idPlayer, idTopic }, select: ['id'] })
      .then(topicPlayerSettings => topicPlayerSettings?.id);
    await this.topicPlayerSettingsRepository.save({ id, idTopic, idPlayer, notifications });
  }
}
