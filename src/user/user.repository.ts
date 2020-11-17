import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { UserGetDto } from './user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async get(dto: UserGetDto, one?: true): Promise<User[] | User | undefined> {
    const qb = this.createQueryBuilder('user').fillAndWhere('user', dto);
    if (one) {
      return qb.getOne();
    } else {
      return qb.getMany();
    }
  }

  async getBySteamid(steamid: string): Promise<User | undefined> {
    return this.createQueryBuilder('u')
      .innerJoin('u.player', 'p')
      .innerJoin('p.steamProfile', 's')
      .andWhere('s.steamid = :steamid', { steamid })
      .getOne();
  }
}
