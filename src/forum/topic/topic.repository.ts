import { EntityRepository, Repository } from 'typeorm';
import { Topic } from './topic.entity';
import { TopicViewModel } from './topic.view-model';
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
  async findBySubCategory(idSubCategory: number, idPlayer: number): Promise<TopicViewModel[]> {
    const queryBuilder = this.createQueryBuilder('topic')
      .select('topic.id', 'id')
      .addSelect('topic.name', 'name')
      .addSelect('topic.idSubCategory', 'idSubCategory')
      .addSelect('topic.idScore', 'idScore')
      .addSelect('topic.idPlayer', 'idPlayer')
      .addSelect('topic.views', 'views')
      .addSelect('topic.pinned', 'pinned')
      .addSelect('topic.lockedDate', 'lockedDate')
      .addSelect('player_last_post.id', 'idPlayerLastPost')
      .addSelect('player_last_post.personaName', 'playerPersonaNameLastPost')
      .addSelect('last_post.creationDate', 'lastPostDate')
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
      .addOrderBy('last_post.creationDate', 'DESC')
      .addOrderBy('topic.id', 'ASC');
    const topicsRaw: TopicRaw[] = await queryBuilder.getRawMany();
    return topicsRaw.map(mapFromTopicRawToTopicViewModel);
  }
}
