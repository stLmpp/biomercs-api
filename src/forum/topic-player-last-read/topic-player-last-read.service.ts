import { Injectable } from '@nestjs/common';
import { TopicPlayerLastReadRepository } from './topic-player-last-read.repository';

@Injectable()
export class TopicPlayerLastReadService {
  constructor(private topicPlayerLastReadRepository: TopicPlayerLastReadRepository) {}

  async upsert(idPlayer: number, idTopic: number): Promise<void> {
    const topicPlayerLastRead = await this.topicPlayerLastReadRepository.findOne({
      where: { idPlayer, idTopic },
      select: ['id'],
    });
    await this.topicPlayerLastReadRepository.save({
      id: topicPlayerLastRead?.id,
      idPlayer,
      idTopic,
      readDate: new Date(),
    });
  }
}
