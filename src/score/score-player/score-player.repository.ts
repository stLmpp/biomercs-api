import { EntityRepository, Repository } from 'typeorm';
import { ScorePlayer } from './score-player.entity';

@EntityRepository(ScorePlayer)
export class ScorePlayerRepository extends Repository<ScorePlayer> {
  async findCountByIdScoreWithoutCreator(idScore: number): Promise<number> {
    return (
      this.createQueryBuilder('sp')
        .innerJoin('sp.score', 's')
        .andWhere('sp.idScore = :idScore', { idScore })
        .andWhere('sp.idPlayer != s.createdByIdPlayer')
        .innerJoin('sp.player', 'p')
        .leftJoin('sp.user', 'u')
        .andWhere('(u.bannedDate is null or p.idUser is null or p.noUser = true)')
        .getCount()
    );
  }
}
