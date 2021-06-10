import { EntityRepository, Repository } from 'typeorm';
import { Platform } from './platform.entity';
import { ScoreStatusEnum } from '../score/score-status/score-status.enum';
import { includeScoreQueryBuilder } from '../score/shared';

@EntityRepository(Platform)
export class PlatformRepository extends Repository<Platform> {
  findApproval(idScoreStatus: ScoreStatusEnum, idPlayer?: number): Promise<Platform[]> {
    return this.createQueryBuilder('p')
      .andExists(subQuery =>
        includeScoreQueryBuilder(subQuery, idScoreStatus, idPlayer).andWhere('spgmg.idPlatform = p.id')
      )
      .getMany();
  }
}
