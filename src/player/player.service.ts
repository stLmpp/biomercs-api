import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PlayerRepository } from './player.repository';
import { Player } from './player.entity';
import { PlayerAddDto, PlayerSearchDto, PlayerSearchPaginatedDto, PlayerUpdateDto } from './player.dto';
import { SteamService } from '../steam/steam.service';
import { RegionService } from '../region/region.service';
import { NotOrNull } from '../util/find-operator';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { FindConditions, ILike, In, Not } from 'typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { isAfter, subDays } from 'date-fns';
import sharp from 'sharp';
import { FileType } from '../file-upload/file.type';
import { FileUploadService } from '../file-upload/file-upload.service';
import { Environment } from '../environment/environment';

@Injectable()
export class PlayerService {
  constructor(
    private playerRepository: PlayerRepository,
    @Inject(forwardRef(() => SteamService)) private steamService: SteamService,
    private regionService: RegionService,
    private fileUploadService: FileUploadService,
    private environment: Environment
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

  async findByIdUserOrFail(idUser: number): Promise<Player> {
    return this.playerRepository.findOneOrFail({ where: { idUser } });
  }

  async findByIdSteamProfile(idSteamProfile: number): Promise<Player | undefined> {
    return this.playerRepository.findOne({ where: { idSteamProfile } });
  }

  async findById(idPlayer: number): Promise<Player> {
    const player = await this.playerRepository.findOne(idPlayer, {
      relations: ['region', 'steamProfile', 'inputType'],
    });
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    return player;
  }

  async findByIdWithUser(idPlayer: number): Promise<Player> {
    return this.playerRepository.findOneOrFail(idPlayer, { relations: ['user'] });
  }

  async update(idPlayer: number, dto: PlayerUpdateDto): Promise<Player> {
    const player = await this.playerRepository.findOneOrFail(idPlayer);
    await this.playerRepository.update(idPlayer, dto);
    if (dto.idRegion && player.idRegion !== dto.idRegion) {
      player.region = await this.regionService.findById(dto.idRegion);
    }
    return new Player().extendDto({ ...player, ...dto });
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

  async unlinkSteamProfile(idPlayer: number): Promise<Player> {
    return this.update(idPlayer, { idSteamProfile: undefined });
  }

  async findIdByPersonaName(personaName: string): Promise<number> {
    return this.playerRepository.findOneOrFail({ select: ['id'], where: { personaName } }).then(player => player.id);
  }

  async findIdByIdUser(idUser: number): Promise<number> {
    return this.playerRepository.findOneOrFail({ select: ['id'], where: { idUser } }).then(player => player.id);
  }

  async findBySearchPaginated({
    personaName,
    page,
    limit,
    isAdmin,
    idUser,
    idPlayersSelected,
  }: PlayerSearchPaginatedDto): Promise<Pagination<Player>> {
    const where: FindConditions<Player> = { personaName: ILike(`%${personaName}%`) };
    if (!isAdmin) {
      where.idUser = NotOrNull(idUser);
    }
    if (idPlayersSelected.length) {
      where.id = Not(In(idPlayersSelected));
    }
    return this.playerRepository.paginate({ page, limit }, { where, order: { personaName: 'ASC' } });
  }

  async findBySearch({ personaName, isAdmin, idUser, idPlayersSelected }: PlayerSearchDto): Promise<Player[]> {
    const where: FindConditions<Player> = { personaName: ILike(`%${personaName}%`) };
    if (!isAdmin) {
      where.idUser = NotOrNull(idUser);
    }
    if (idPlayersSelected.length) {
      where.id = Not(In(idPlayersSelected));
    }
    return this.playerRepository.find({ where, order: { personaName: 'ASC' }, take: 150 });
  }

  async personaNameExists(personaName: string): Promise<boolean> {
    return this.playerRepository.exists({ personaName });
  }

  async personaNameExistsWithoutUser(personaName: string): Promise<boolean> {
    return this.playerRepository.exists({ personaName, noUser: true });
  }

  async updatePersonaName(idPlayer: number, personaName: string): Promise<string> {
    const player = await this.playerRepository.findOneOrFail(idPlayer);
    if (player.personaName === personaName) {
      throw new BadRequestException('New personaName is the same as the old personaName');
    }
    if (await this.personaNameExists(personaName)) {
      throw new BadRequestException('PersonaName already taken');
    }
    if (player.lastUpdatedPersonaNameDate && isAfter(player.lastUpdatedPersonaNameDate, subDays(new Date(), 7))) {
      throw new BadRequestException(`Too many updates in the last 7 days`);
    }
    const lastUpdatedPersonaNameDate = new Date();
    await this.playerRepository.update(idPlayer, { personaName, lastUpdatedPersonaNameDate });
    return lastUpdatedPersonaNameDate.toISOString();
  }

  async avatar(idPlayer: number, file: FileType): Promise<string> {
    const buffer = await sharp(file.buffer).resize({ height: 300, width: 300 }).png().toBuffer();
    const avatar = `${idPlayer}.png`;
    await this.fileUploadService.sendFile(
      { ...file, buffer },
      { path: this.environment.get('AWS_S3_BUCKET_IMAGE_AVATAR'), name: avatar }
    );
    await this.playerRepository.update(idPlayer, { avatar });
    return avatar;
  }
}
