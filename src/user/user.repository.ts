import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { UserGetDto } from './user.dto';
import { UserOnlineViewModel } from './user.view-model';
import { subMinutes } from 'date-fns';

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

  async findOwnerWithPasswordAndSalt(): Promise<User> {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.player', 'p')
      .addSelect('user.password')
      .addSelect('user.salt')
      .andWhere('user.owner = :owner', { owner: true })
      .getOneOrFail();
  }

  async findIdByScore(idScore: number): Promise<number | undefined> {
    return this.createQueryBuilder('user')
      .select('user.id')
      .innerJoin('user.player', 'player')
      .innerJoin('player.scores', 'score')
      .andWhere('score.id = :idScore', { idScore })
      .getOne()
      .then(user => user?.id);
  }

  async findIdsByScore(idScore: number): Promise<number[]> {
    const users = await this.createQueryBuilder('user')
      .select('user.id')
      .innerJoin('user.player', 'player')
      .innerJoin('player.scorePlayers', 'scorePlayer')
      .innerJoin('scorePlayer.score', 'score')
      .andWhere('score.id = :idScore', { idScore })
      .getMany();
    return users.map(user => user.id);
  }

  async findIdsByPlayers(idPlayers: number[]): Promise<number[]> {
    const users = await this.createQueryBuilder('user')
      .select('user.id')
      .innerJoin('user.player', 'player')
      .andWhere('player.id in (:...idPlayers)', { idPlayers })
      .getMany();
    return users.map(user => user.id);
  }

  async isAdminByPlayer(idPlayer: number): Promise<boolean> {
    return this.createQueryBuilder('u')
      .select('u.admin')
      .innerJoin('u.player', 'p')
      .andWhere('p.id = :idPlayer', { idPlayer })
      .getOneOrFail()
      .then(user => user.admin || user.owner);
  }

  findOnline(): Promise<UserOnlineViewModel[]> {
    return this.createQueryBuilder('user')
      .innerJoin('user.player', 'player')
      .select('user.id', 'id')
      .addSelect('player.id', 'idPlayer')
      .addSelect('player.personaName', 'personaName')
      .andWhere('user.lastOnline > :lastOnline', { lastOnline: subMinutes(new Date(), 1) })
      .getRawMany();
  }
}
