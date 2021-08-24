import { EntityRepository, Repository } from 'typeorm';
import { PostEntity } from './post.entity';

@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {
  async findLastPostCategory(idSubCategory: number, idPlayer: number): Promise<PostEntity | undefined> {
    return this.createQueryBuilder('p')
      .innerJoinAndSelect('p.topic', 't')
      .innerJoinAndSelect('p.player', 'pl')
      .leftJoinAndSelect('t.topicPlayerLastReads', 'tplr', 'tplr.idPlayer = :idPlayer', { idPlayer })
      .andWhere('t.idSubCategory = :idSubCategory', { idSubCategory })
      .orderBy('p.id', 'DESC')
      .getOne();
  }
}
