import { Injectable } from '@nestjs/common';
import { TopicRepository } from './topic.repository';
import { TopicViewModelPaginated } from './topic.view-model';
import { Topic } from './topic.entity';
import { Cron } from '@nestjs/schedule';
import { UpdateResult } from 'typeorm';

@Injectable()
export class TopicService {
  constructor(private topicRepository: TopicRepository) {}

  private readonly _increaseViewsMap = new Map<number, number>();

  @Cron('*/30 * * * * *')
  async increaseViewsCron(): Promise<void> {
    if (!this._increaseViewsMap.size) {
      return;
    }
    const promises: Promise<UpdateResult>[] = [];
    for (const [idTopic, views] of this._increaseViewsMap) {
      promises.push(this.topicRepository.increaseView(idTopic, views));
    }
    this._increaseViewsMap.clear();
    await Promise.all(promises);
  }

  async findBySubCategoryPaginated(
    idSubCategory: number,
    idPlayer: number,
    page: number,
    limit: number
  ): Promise<TopicViewModelPaginated> {
    return this.topicRepository.findBySubCategoryPaginated(idSubCategory, idPlayer, page, limit);
  }

  async findRecentTopics(limit: number): Promise<Topic[]> {
    return this.topicRepository.findRecentTopics(limit);
  }

  increaseView(idTopic: number): void {
    const views = this._increaseViewsMap.get(idTopic) ?? 0;
    this._increaseViewsMap.set(idTopic, views + 1);
  }
}
