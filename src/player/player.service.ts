import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PlayerRepository } from './player.repository';
import { Player } from './player.entity';
import { PlayerAddDto, PlayerUpdateDto } from './player.dto';
import { SteamService } from '../steam/steam.service';
import { RegionService } from '../region/region.service';

@Injectable()
export class PlayerService {
  constructor(
    private playerRepository: PlayerRepository,
    @Inject(forwardRef(() => SteamService)) private steamService: SteamService,
    private regionService: RegionService
  ) {}

  async add(dto: PlayerAddDto & { noUser?: boolean }): Promise<Player> {
    if (!dto.idRegion) {
      dto.idRegion = await this.regionService.findDefaultIdRegion();
    }
    return this.playerRepository.save(new Player().extendDto(dto));
  }

  async findByIdUser(idUser: number): Promise<Player | undefined> {
    return this.playerRepository.findOne({ where: { idUser } });
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

  async update(idPlayer: number, dto: PlayerUpdateDto): Promise<Player> {
    const player = await this.playerRepository.findOneOrFail(idPlayer);
    await this.playerRepository.update(idPlayer, dto);
    if (dto.idRegion && player.idRegion !== dto.idRegion) {
      player.region = await this.regionService.findById(dto.idRegion);
    }
    return new Player().extendDto({ ...player, ...dto });
  }

  async delete(idPlayer: number): Promise<void> {
    await this.playerRepository.delete(idPlayer);
  }

  async linkSteamProfile(idPlayer: number): Promise<string> {
    const player = await this.findById(idPlayer);
    if (player.idSteamProfile) {
      throw new BadRequestException('Player already have a steam linked');
    }
    return this.steamService.openIdUrl(player);
  }

  async unlinkSteamProfile(idPlayer: number): Promise<Player> {
    return this.update(idPlayer, { idSteamProfile: undefined });
  }

  async findIdByPersonaName(personaName: string): Promise<number> {
    return (await this.playerRepository.findOneOrFail({ select: ['id'], where: { personaName } })).id;
  }

  async findIdByIdUser(idUser: number): Promise<number> {
    return (await this.playerRepository.findOneOrFail({ select: ['id'], where: { idUser } })).id;
  }
}
