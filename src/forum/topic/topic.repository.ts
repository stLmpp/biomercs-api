import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import { Topic } from './topic.entity';
import { TopicViewModel, TopicViewModelPaginated } from './topic.view-model';
import { PostEntity } from '../post/post.entity';
import { TopicPlayerLastRead } from '../topic-player-last-read/topic-player-last-read.entity';
import { plainToClass } from 'class-transformer';

type TopicRaw = Omit<TopicViewModel, 'repliesCount' | 'hasNewPosts'> & {
  repliesCount: string;
  hasNewPosts: boolean | null;
};

function mapFromTopicRawToTopicViewModel(topicRaw: TopicRaw): TopicViewModel {
  return plainToClass(TopicViewModel, {
    ...topicRaw,
    repliesCount: +topicRaw.repliesCount,
    hasNewPosts: !!topicRaw.hasNewPosts,
  });
}

@EntityRepository(Topic)
export class TopicRepository extends Repository<Topic> {
  async findBySubCategoryPaginated(
    idSubCategory: number,
    idPlayer: number,
    page: number,
    limit: number
  ): Promise<TopicViewModelPaginated> {
    const queryBuilder = this.createQueryBuilder('topic')
      .select('topic.id', 'id')
      .addSelect('topic.name', 'name')
      .addSelect('topic.idSubCategory', 'idSubCategory')
      .addSelect('topic.idScore', 'idScore')
      .addSelect('topic.idPlayer', 'idPlayer')
      .addSelect('player.personaName', 'playerPersonaName')
      .addSelect('topic.views', 'views')
      .addSelect('topic.pinned', 'pinned')
      .addSelect('topic.lockedDate', 'lockedDate')
      .addSelect('player_last_post.id', 'idPlayerLastPost')
      .addSelect('player_last_post.personaName', 'playerPersonaNameLastPost')
      .addSelect('last_post.creationDate', 'lastPostDate')
      .addSelect('last_post.id', 'idLastPost')
      .addSelect('last_post.name', 'nameLastPost')
      .addSelect('topic.creationDate', 'creationDate')
      .addSelect(
        subQuery =>
          subQuery
            .subQuery()
            .select('count(1)')
            .from(PostEntity, 'post_count')
            .andWhere('post_count.idTopic = topic.id'),
        'repliesCount'
      )
      .addSelect(
        subQuery =>
          subQuery
            .subQuery()
            .select('last_read.readDate < last_post.creationDate')
            .from(TopicPlayerLastRead, 'last_read')
            .andWhere('last_read.idTopic = topic.id')
            .andWhere('last_read.idPlayer = :idPlayer', { idPlayer }),
        'hasNewPosts'
      )
      .innerJoin('topic.posts', 'last_post')
      .innerJoin('last_post.player', 'player_last_post')
      .innerJoin('topic.player', 'player')
      .andWhere('topic.idSubCategory = :idSubCategory', { idSubCategory })
      .andWhere(
        subQuery =>
          `last_post.id = (${subQuery
            .subQuery()
            .addSelect('post_join.id')
            .from(PostEntity, 'post_join')
            .andWhere('post_join.idTopic = topic.id')
            .orderBy('post_join.id', 'DESC')
            .limit(1)
            .getQuery()})`
      )
      .addOrderBy('topic.pinned', 'DESC')
      .addOrderBy('last_post.creationDate', 'DESC')
      .addOrderBy('topic.id', 'ASC');
    const paginated = await queryBuilder.paginateRaw<TopicRaw>(page, limit);
    return new TopicViewModelPaginated(paginated.items.map(mapFromTopicRawToTopicViewModel), paginated.meta);
  }

  async findRecentTopics(limit: number): Promise<Topic[]> {
    return this.createQueryBuilder('topic')
      .innerJoinAndSelect('topic.posts', 'last_post')
      .innerJoinAndSelect('topic.subCategory', 'sub_category')
      .innerJoinAndSelect('last_post.player', 'player_last_post')
      .andWhere(
        subQuery =>
          `last_post.id = (${subQuery
            .subQuery()
            .addSelect('post_join.id')
            .from(PostEntity, 'post_join')
            .andWhere('post_join.idTopic = topic.id')
            .orderBy('post_join.id', 'DESC')
            .limit(1)
            .getQuery()})`
      )
      .limit(limit)
      .addOrderBy('last_post.creationDate', 'DESC')
      .getMany();
  }

  async increaseView(idTopic: number, views: number): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update()
      .set({ views: () => `views + ${views}` })
      .where({ id: idTopic })
      .execute();
  }
}
