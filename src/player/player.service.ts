import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PlayerRepository } from './player.repository';
import { Player } from './player.entity';
import { PlayerAddDto, PlayerUpdateDto } from './player.dto';
import { SteamService } from '../steam/steam.service';
import { updateLastUpdatedBy } from '../auth/last-updated-by.pipe';

@Injectable()
export class PlayerService {
  constructor(
    private playerRepository: PlayerRepository,
    @Inject(forwardRef(() => SteamService)) private steamService: SteamService
  ) {}

  async add(dto: PlayerAddDto & { noUser?: boolean }): Promise<Player> {
    return this.playerRepository.save(new Player().extendDto(dto));
  }

  async findByIdUser(idUser: number): Promise<Player | undefined> {
    return this.playerRepository.findOne({ where: { idUser } });
  }

  async findByIdSteamProfile(idSteamProfile: number): Promise<Player | undefined> {
    return this.playerRepository.findOne({ where: { idSteamProfile } });
  }

  async findById(idPlayer: number): Promise<Player> {
    const player = await this.playerRepository.findOne(idPlayer);
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    return player;
  }

  async update(idPlayer: number, dto: PlayerUpdateDto): Promise<Player> {
    const player = await this.findById(idPlayer);
    await this.playerRepository.update(idPlayer, dto);
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

  async unlinkSteamProfile(idPlayer: number, idUser: number): Promise<Player> {
    return this.update(idPlayer, updateLastUpdatedBy({ idSteamProfile: undefined }, idUser));
  }
}
