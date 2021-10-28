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

  async findByAuthCode(code: number): Promise<User | undefined> {
    return this.createQueryBuilder('u')
      .innerJoin('u.currentAuthConfirmation', 'ac')
      .leftJoinAndSelect('u.player', 'p')
      .andWhere('ac.code = :code', { code })
      .getOne();
  }

  async findByIdWithPasswordAndSalt(idUser: number): Promise<User> {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.player', 'p')
      .addSelect('user.password')
      .addSelect('user.salt')
      .andWhere('user.id = :idUser', { idUser })
      .getOneOrFail();
  }
}
