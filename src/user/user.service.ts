import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserAddDto, UserGetDto, UserUpdateDto } from './user.dto';
import { User } from './user.entity';
import { AuthCredentialsDto } from '../auth/auth.dto';
import { FindConditions } from 'typeorm';
import { UserViewModel } from './user.view-model';
import { MapperService } from '../mapper/mapper.service';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository, private mapperService: MapperService) {}

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

  async update(idUser: number, dto: UserUpdateDto): Promise<UserViewModel> {
    const user = await this.userRepository.findOne(idUser);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.update(idUser, dto);
    return this.mapperService.map(User, UserViewModel, new User().extendDto({ ...user, ...dto }));
  }

  async updatePassword(idUser: number, password: string): Promise<User> {
    const user = await this.userRepository.findOne(idUser);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.update(idUser, { password });
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

  async validateUserToLogin(dto: AuthCredentialsDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [{ username: dto.username }, { email: dto.username }],
    });
    if (!user) {
      throw new UnauthorizedException('User or password invalid');
    }
    const { salt, password } = await this.getPasswordAndSalt(user.id);
    user.salt = salt;
    user.password = password;
    const isPasswordValid = await user.validatePassword(dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('User or password invalid');
    }
    return user;
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
    await this.userRepository.update(idUser, { bannedDate: null });
  }
}
