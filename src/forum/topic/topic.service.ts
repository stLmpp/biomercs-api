import { Injectable } from '@nestjs/common';
import { TopicRepository } from './topic.repository';
import { TopicViewModel, TopicViewModelPaginated, TopicWithPostsViewModel } from './topic.view-model';
import { Topic } from './topic.entity';
import { Cron } from '@nestjs/schedule';
import { UpdateResult } from 'typeorm';
import { PostService } from '../post/post.service';

@Injectable()
export class TopicService {
  constructor(private topicRepository: TopicRepository, private postService: PostService) {}

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

  async findByIdWithPostsPaginated(
    idTopic: number,
    idPlayer: number,
    page: number,
    limit: number
  ): Promise<TopicWithPostsViewModel> {
    const [topic, posts] = await Promise.all([
      this.topicRepository.findById(idTopic, idPlayer),
      this.postService.findByTopicPaginated(idTopic, idPlayer, page, limit),
    ]);
    const topicWithPostsViewModel = new TopicWithPostsViewModel();
    Object.assign(topicWithPostsViewModel, topic);
    topicWithPostsViewModel.posts = posts;
    return topicWithPostsViewModel;
  }

  async delete(idTopic: number): Promise<void> {
    await this.topicRepository.softDelete(idTopic);
  }

  async lock(idTopic: number, idPlayer: number): Promise<TopicViewModel> {
    await this.topicRepository.update(idTopic, { lockedDate: new Date() });
    return this.topicRepository.findById(idTopic, idPlayer);
  }

  async unlock(idTopic: number, idPlayer: number): Promise<TopicViewModel> {
    await this.topicRepository.update(idTopic, { lockedDate: null });
    return this.topicRepository.findById(idTopic, idPlayer);
  }

  async pin(idTopic: number): Promise<void> {
    await this.topicRepository.update(idTopic, { pinned: true });
  }

  async unpin(idTopic: number): Promise<void> {
    await this.topicRepository.update(idTopic, { pinned: false });
  }
}
