import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserAddDto, UserGetDto, UserUpdateDto } from './user.dto';
import { User } from './user.entity';
import { AuthCredentialsDto } from '../auth/auth.dto';
import { FindConditions, ILike } from 'typeorm';
import { isAfter, subDays } from 'date-fns';
import { Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  private _getWhereEmailOrUsername(username?: string, email?: string): FindConditions<User>[] {
    const where: FindConditions<User>[] = [];
    if (username) {
      where.push({ username });
    }
    if (email) {
      where.push({ email });
    }
    return where;
  }

  async add(dto: UserAddDto): Promise<User> {
    return this.userRepository.save(new User().extendDto(dto));
  }

  async update(idUser: number, dto: UserUpdateDto): Promise<User> {
    const user = await this.userRepository.findOne(idUser, { relations: ['player'] });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.update(idUser, dto);
    return new User().extendDto({ ...user, ...dto });
  }

  async updatePasswordAndRemoveLocks(idUser: number, password: string): Promise<User> {
    const user = await this.userRepository.findOneOrFail(idUser);
    await this.userRepository.update(idUser, { password, idCurrentAuthConfirmation: null, lockedDate: null });
    user.password = password;
    user.idCurrentAuthConfirmation = null;
    user.lockedDate = null;
    return user;
  }

  async getById(idUser: number): Promise<User | undefined> {
    return this.userRepository.findOne(idUser);
  }

  async get(dto: UserGetDto, one: true): Promise<User | undefined>;
  async get(dto: UserGetDto): Promise<User[]>;
  async get(dto: UserGetDto, one?: true): Promise<User[] | User | undefined> {
    return this.userRepository.get(dto, one);
  }

  async getByEmailOrUsername(username?: string, email?: string): Promise<User | undefined> {
    if (!username && !email) {
      throw new BadRequestException('Needs at least one parameter');
    }
    const where = this._getWhereEmailOrUsername(username, email);
    return this.userRepository.findOne({ where });
  }

  async anyByEmailOrUsername(username?: string, email?: string): Promise<boolean> {
    if (!username && !email) {
      throw new BadRequestException('Needs at least one parameter');
    }
    const where = this._getWhereEmailOrUsername(username, email);
    return this.userRepository.exists(where);
  }

  async validateUserToLogin(dto: AuthCredentialsDto): Promise<[User | undefined, HttpException | null]> {
    const user = await this.userRepository.findOne({
      where: [{ username: dto.username }, { email: dto.username }],
      relations: ['player'],
    });
    if (!user || !user.canLogin()) {
      if (user?.bannedDate) {
        return [user, new ForbiddenException(`Account is locked.`)];
      }
      if (user?.lockedDate) {
        return [user, new ForbiddenException(`Account is locked. Reset your password to unlock it.`)];
      }
      return [user, new UnauthorizedException('User or password invalid')];
    }
    const { salt, password } = await this.getPasswordAndSalt(user.id);
    user.salt = salt;
    user.password = password;
    const isPasswordValid = await user.validatePassword(dto.password);
    if (!isPasswordValid) {
      return [user, new UnauthorizedException('User or password invalid')];
    }
    return [user, null];
  }

  async findByIdWithPasswordAndSaltOrFail(idUser: number): Promise<User> {
    return this.userRepository.findByIdWithPasswordAndSalt(idUser);
  }

  async getPasswordAndSalt(idUser: number): Promise<Pick<User, 'password' | 'salt'>> {
    const user = await this.userRepository.findOne(idUser, { select: ['password', 'salt'] });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getBySteamid(steamid: string): Promise<User | undefined> {
    return this.userRepository.getBySteamid(steamid);
  }

  async findByAuthCode(code: number): Promise<User | undefined> {
    return this.userRepository.findByAuthCode(code);
  }

  async banUser(idUser: number): Promise<void> {
    await this.userRepository.update(idUser, { bannedDate: new Date() });
  }

  async unbanUser(idUser: number): Promise<void> {
    const user = await this.userRepository.findOneOrFail(idUser);
    if (user.bannedDate && isAfter(user.bannedDate, subDays(new Date(), 7))) {
      throw new BadRequestException(`User has been banned recently, can't be unbanned now`);
    }
    await this.userRepository.update(idUser, { bannedDate: null });
  }

  async findByUsernameOrEmail(usernameOrEmail: string, page: number, limit: number): Promise<Pagination<User>> {
    usernameOrEmail = `%${usernameOrEmail}%`;
    return this.userRepository.paginate(
      { page, limit },
      {
        where: [{ username: ILike(usernameOrEmail) }, { email: ILike(usernameOrEmail) }],
        order: { username: 'ASC' },
        relations: ['player'],
      }
    );
  }

  async lockUser(idUser: number): Promise<void> {
    await this.userRepository.update(idUser, { lockedDate: new Date() });
  }

  async findIdByScore(idScore: number): Promise<number | undefined> {
    return this.userRepository.findIdByScore(idScore);
  }

  async findIdsByScore(idScore: number): Promise<number[]> {
    return this.userRepository.findIdsByScore(idScore);
  }

  async findIdsByPlayers(idPlayers: number[]): Promise<number[]> {
    return this.userRepository.findIdsByPlayers(idPlayers);
  }
}
