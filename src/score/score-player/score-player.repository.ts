import { EntityRepository, Repository } from 'typeorm';
import { ScorePlayer } from './score-player.entity';

@EntityRepository(ScorePlayer)
export class ScorePlayerRepository extends Repository<ScorePlayer> {
  async findCountByIdScoreWithoutCreator(idScore: number): Promise<number> {
    return this.createQueryBuilder('sp')
      .innerJoin('sp.score', 's')
      .andWhere('sp.idScore = :idScore', { idScore })
      .andWhere('sp.idPlayer != s.createdByIdPlayer')
      .getCount();
  }
}
