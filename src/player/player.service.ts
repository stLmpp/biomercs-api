import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PlayerRepository } from './player.repository';
import { Player } from './player.entity';
import { PlayerAddDto, PlayerUpdateDto } from './player.dto';
import { SteamService } from '../steam/steam.service';
import { RegionService } from '../region/region.service';
import { NotOrNull } from '../util/find-operator';
import { PlayerViewModel, PlayerWithRegionSteamProfileViewModel } from './player.view-model';
import { MapperService } from '../mapper/mapper.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { ILike } from 'typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class PlayerService {
  constructor(
    private playerRepository: PlayerRepository,
    @Inject(forwardRef(() => SteamService)) private steamService: SteamService,
    private regionService: RegionService,
    private mapperService: MapperService
  ) {}

  @Transactional()
  async add({ steamid, ...dto }: PlayerAddDto & { noUser?: boolean }): Promise<Player> {
    if (!dto.personaName && !steamid) {
      throw new BadRequestException('personaName or steamid is required to create a player');
    }
    if (dto.personaName && dto.personaName.length < 3) {
      throw new BadRequestException('personaName must have at least 3 characters');
    }
    if (!dto.idSteamProfile && steamid) {
      const steamProfile = await this.steamService.create(steamid);
      dto.idSteamProfile = steamProfile.id;
      if (steamProfile.loccountrycode && !dto.idRegion) {
        const possibleIdRegion = await this.regionService.findIdByShortName(steamProfile.loccountrycode);
        if (possibleIdRegion) {
          dto.idRegion = possibleIdRegion;
        }
      }
      if (!dto.personaName) {
        dto.personaName = steamProfile.personaname;
      }
    }
    if (!dto.idRegion) {
      dto.idRegion = await this.regionService.findDefaultIdRegion();
    }
    return this.playerRepository.save(new Player().extendDto(dto));
  }

  async findByIdUser(idUser: number): Promise<Player | undefined> {
    return this.playerRepository.findOne({ where: { idUser } });
  }

  async findByIdUserOrThrow(idUser: number): Promise<PlayerViewModel> {
    const player = await this.playerRepository.findOneOrFail({ where: { idUser } });
    return this.mapperService.map(Player, PlayerViewModel, player);
  }

  async findByIdSteamProfile(idSteamProfile: number): Promise<Player | undefined> {
    return this.playerRepository.findOne({ where: { idSteamProfile } });
  }

  async findById(idPlayer: number): Promise<Player> {
    const player = await this.playerRepository.findOne(idPlayer, { relations: ['region', 'steamProfile'] });
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    return player;
  }

  async findByIdWithUser(idPlayer: number): Promise<Player> {
    return this.playerRepository.findOneOrFail(idPlayer, { relations: ['user'] });
  }

  async findByIdMapped(idPlayer: number): Promise<PlayerWithRegionSteamProfileViewModel> {
    const player = await this.findById(idPlayer);
    return this.mapperService.map(Player, PlayerWithRegionSteamProfileViewModel, player);
  }

  async update(idPlayer: number, dto: PlayerUpdateDto): Promise<PlayerWithRegionSteamProfileViewModel> {
    const player = await this.playerRepository.findOneOrFail(idPlayer);
    await this.playerRepository.update(idPlayer, dto);
    if (dto.idRegion && player.idRegion !== dto.idRegion) {
      player.region = await this.regionService.findById(dto.idRegion);
    }
    return this.mapperService.map(
      Player,
      PlayerWithRegionSteamProfileViewModel,
      new Player().extendDto({ ...player, ...dto })
    );
  }

  async updateIdUser(idPlayer: number, idUser: number): Promise<void> {
    await this.playerRepository.update(idPlayer, { idUser });
  }

  async delete(idPlayer: number): Promise<void> {
    await this.playerRepository.delete(idPlayer);
  }

  async linkSteamProfile(idPlayer: number): Promise<string> {
    const player = await this.playerRepository.findOneOrFail(idPlayer);
    if (player.idSteamProfile) {
      throw new BadRequestException('Player already have a steam linked');
    }
    return this.steamService.openIdUrl(player);
  }

  async unlinkSteamProfile(idPlayer: number): Promise<PlayerWithRegionSteamProfileViewModel> {
    return this.update(idPlayer, { idSteamProfile: undefined });
  }

  async findIdByPersonaName(personaName: string): Promise<number> {
    return this.playerRepository.findOneOrFail({ select: ['id'], where: { personaName } }).then(player => player.id);
  }

  async findIdByIdUser(idUser: number): Promise<number> {
    return this.playerRepository.findOneOrFail({ select: ['id'], where: { idUser } }).then(player => player.id);
  }

  async findBySearch(
    personaName: string,
    idUser: number,
    page: number,
    limit: number
  ): Promise<Pagination<PlayerViewModel>> {
    const { items, meta } = await this.playerRepository.paginate(
      { page, limit },
      { where: { personaName: ILike(`%${personaName}%`), idUser: NotOrNull(idUser) } }
    );
    const players = this.mapperService.map(Player, PlayerViewModel, items);
    return new Pagination(players, meta);
  }

  async personaNameExists(personaName: string): Promise<boolean> {
    return this.playerRepository.exists({ personaName });
  }

  async personaNameExistsWithoutUser(personaName: string): Promise<boolean> {
    return this.playerRepository.exists({ personaName, noUser: true });
  }
}
