import { EntityRepository, Repository } from 'typeorm';
import { PostEntity } from './post.entity';
import { PostViewModelPagination } from './post.view-model';

@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {
  async findByTopicPaginated(
    idTopic: number,
    idPlayer: number,
    page: number,
    limit: number
  ): Promise<PostViewModelPagination> {
    const queryBuilder = this.createQueryBuilder('post')
      .select('post.id', 'id')
      .addSelect('post.name', 'name')
      .addSelect('post.post', 'post')
      .addSelect('post.idTopic', 'idTopic')
      .addSelect('player.id', 'idPlayer')
      .addSelect('post.deletedDate', 'deletedDate')
      .addSelect('player.personaName', 'personaNamePlayer')
      .addSelect(
        subQuery =>
          subQuery
            .subQuery()
            .select('count(1)')
            .from(PostEntity, 'post_count')
            .andWhere('post_count.idPlayer = post.idPlayer'),
        'postCount'
      )
      .addSelect('region.id', 'idRegion')
      .addSelect('region.name', 'nameRegion')
      .addSelect('region.shortName', 'shortNameRegion')
      .addSelect(`player.id = ${idPlayer}`, 'editAllowed')
      .addSelect(
        subQuery =>
          subQuery
            .subQuery()
            .select(`(player.id = ${idPlayer} AND post_first.id != post.id)`)
            .from(PostEntity, 'post_first')
            .andWhere('post_first.idTopic = :idTopic')
            .orderBy('post_first.id', 'ASC')
            .limit(1),
        'deleteAllowed'
      )
      .innerJoin('post.player', 'player')
      .innerJoin('player.region', 'region')
      .andWhere('post.idTopic = :idTopic', { idTopic })
      .orderBy('post.id', 'ASC');
    return queryBuilder.paginateRaw(page, limit);
  }
}
