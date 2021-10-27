import { Injectable } from '@nestjs/common';
import { TopicPlayerSettingsRepository } from './topic-player-settings.repository';
import { TopicPlayerSettings } from './topic-player-settings.entity';
import { Not } from 'typeorm';

@Injectable()
export class TopicPlayerSettingsService {
  constructor(private topicPlayerSettingsRepository: TopicPlayerSettingsRepository) {}

  async upsert(idTopic: number, idPlayer: number, notifications: boolean): Promise<void> {
    const topicPlayerSettings = await this.topicPlayerSettingsRepository.findOne({
      where: { idPlayer, idTopic },
      select: ['id'],
    });
    await this.topicPlayerSettingsRepository.save({ id: topicPlayerSettings?.id, idTopic, idPlayer, notifications });
  }

  async addIfNotSet(idTopic: number, idPlayer: number, notifications: boolean): Promise<void> {
    if (await this.topicPlayerSettingsRepository.exists({ idTopic, idPlayer })) {
      return;
    }
    await this.topicPlayerSettingsRepository.save({ idPlayer, idTopic, notifications });
  }

  async findByIdTopicWithPlayer(idTopic: number, idPlayerNot: number): Promise<TopicPlayerSettings[]> {
    return this.topicPlayerSettingsRepository.find({
      where: { idTopic, notifications: true, idPlayer: Not(idPlayerNot) },
      relations: ['player'],
    });
  }
}
