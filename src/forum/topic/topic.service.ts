import { Injectable } from '@nestjs/common';
import { TopicRepository } from './topic.repository';
import { TopicViewModelPaginated, TopicWithPostsViewModel } from './topic.view-model';
import { Topic } from './topic.entity';
import { Cron } from '@nestjs/schedule';
import { UpdateResult } from 'typeorm';
import { PostService } from '../post/post.service';
import { InjectMapProfile } from '../../mapper/inject-map-profile';
import { PostEntity } from '../post/post.entity';
import { PostViewModel, PostViewModelPagination } from '../post/post.view-model';
import { MapProfile } from '../../mapper/map-profile';

@Injectable()
export class TopicService {
  constructor(
    private topicRepository: TopicRepository,
    private postService: PostService,
    @InjectMapProfile(PostEntity, PostViewModel) private mapProfilePost: MapProfile<PostEntity, PostViewModel>
  ) {}

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
    const [topic, postsPaginated] = await Promise.all([
      this.topicRepository.findById(idTopic, idPlayer),
      this.postService.findByTopicPaginated(idTopic, page, limit),
    ]);
    const topicWithPostsViewModel = new TopicWithPostsViewModel();
    Object.assign(topicWithPostsViewModel, topic);
    topicWithPostsViewModel.posts = new PostViewModelPagination(postsPaginated.items, postsPaginated.meta);
    return topicWithPostsViewModel;
  }
}
