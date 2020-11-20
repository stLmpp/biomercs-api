import { EntityRepository, Repository } from 'typeorm';
import { SteamProfile } from './steam-profile.entity';

@EntityRepository(SteamProfile)
export class SteamProfileRepository extends Repository<SteamProfile> {
  findWithPlayerBySteamid(steamid: string): Promise<SteamProfile | undefined> {
    return this.createQueryBuilder('s')
      .leftJoinAndSelect('s.player', 'p')
      .andWhere('s.steamid = :steamid', { steamid })
      .getOne();
  }
}
