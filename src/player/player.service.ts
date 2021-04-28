import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PlayerRepository } from './player.repository';
import { Player } from './player.entity';
import { PlayerAddDto, PlayerUpdateDto } from './player.dto';
import { SteamService } from '../steam/steam.service';
import { RegionService } from '../region/region.service';
import { LikeUppercase, NotOrNull } from '../util/find-operator';
import { PlayerViewModel, PlayerWithRegionViewModel } from './player.view-model';
import { MapperService } from '../mapper/mapper.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';

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
    const player = await this.playerRepository.findOne(idPlayer, { relations: ['region'] });
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    return player;
  }

  async findByIdMapped(idPlayer: number): Promise<PlayerWithRegionViewModel> {
    const player = await this.findById(idPlayer);
    return this.mapperService.map(Player, PlayerWithRegionViewModel, player);
  }

  async update(idPlayer: number, dto: PlayerUpdateDto): Promise<PlayerWithRegionViewModel> {
    const player = await this.playerRepository.findOneOrFail(idPlayer);
    await this.playerRepository.update(idPlayer, dto);
    if (dto.idRegion && player.idRegion !== dto.idRegion) {
      player.region = await this.regionService.findById(dto.idRegion);
    }
    return this.mapperService.map(Player, PlayerWithRegionViewModel, new Player().extendDto({ ...player, ...dto }));
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

  async unlinkSteamProfile(idPlayer: number): Promise<PlayerWithRegionViewModel> {
    return this.update(idPlayer, { idSteamProfile: undefined });
  }

  async findIdByPersonaName(personaName: string): Promise<number> {
    return this.playerRepository.findOneOrFail({ select: ['id'], where: { personaName } }).then(player => player.id);
  }

  async findIdByIdUser(idUser: number): Promise<number> {
    return this.playerRepository.findOneOrFail({ select: ['id'], where: { idUser } }).then(player => player.id);
  }

  // TODO REMOVE
  async findRandom(idsNot: number[]): Promise<Player> {
    const qb = this.playerRepository.createQueryBuilder('p').orderBy('random()');
    if (idsNot.length) {
      qb.andWhere('p.id not in (:...ids)', { ids: idsNot });
    }
    return qb.getOneOrFail();
  }

  async findBySearch(personaName: string, idUser: number): Promise<PlayerViewModel[]> {
    const players = await this.playerRepository.find({
      where: { personaName: LikeUppercase(`%${personaName}%`), idUser: NotOrNull(idUser) },
    });
    return this.mapperService.map(Player, PlayerViewModel, players);
  }

  async personaNameExists(personaName: string): Promise<boolean> {
    return this.playerRepository.exists({ personaName });
  }
}
