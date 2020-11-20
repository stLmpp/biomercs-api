import { BadRequestException, forwardRef, HttpService, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RawSteamProfile, SteamProfile } from './steam-profile.entity';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { SteamProfileRepository } from './steam-profile.repository';
import { User } from '../user/user.entity';
import { environment } from '../environment/environment';
import { RelyingParty } from 'openid';
import { isString } from 'lodash';
import { PlayerService } from '../player/player.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { Player } from '../player/player.entity';

@Injectable()
export class SteamService {
  constructor(
    private http: HttpService,
    private steamProfileRepository: SteamProfileRepository,
    @Inject(forwardRef(() => PlayerService)) private playerService: PlayerService
  ) {}

  @Transactional()
  async authenticateAndLinkUser(req: Request, idUser: number, returnUrl?: string): Promise<SteamProfile> {
    const player = await this.playerService.findByIdUser(idUser);
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    const rawSteamProfile = await this.authenticate(req, returnUrl);
    const steamProfile =
      (await this.checkIfSteamProfileIsAlreadyLinked(rawSteamProfile.steamid)) ??
      (await this.add(rawSteamProfile, idUser));
    await this.playerService.update(player.id, { idSteamProfile: steamProfile.id });
    return steamProfile;
  }

  @Transactional()
  async authenticateAndLinkPlayer(req: Request, idPlayer: number, returnUrl?: string): Promise<SteamProfile> {
    const player = await this.playerService.findById(idPlayer);
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    const rawSteamProfile = await this.authenticate(req, returnUrl);
    const steamProfile =
      (await this.checkIfSteamProfileIsAlreadyLinked(rawSteamProfile.steamid)) ??
      (await this.add(rawSteamProfile, player.idUser));
    await this.playerService.update(player.id, { idSteamProfile: steamProfile.id });
    return steamProfile;
  }

  @Transactional()
  async create(steamid: string, idUser: number): Promise<SteamProfile> {
    const rawSteamProfile = await this.getPlayerSummary(steamid);
    if (!rawSteamProfile) {
      throw new NotFoundException('Steam profile not found');
    }
    const steamProfile =
      (await this.checkIfSteamProfileIsAlreadyLinked(steamid)) ?? (await this.add(rawSteamProfile, idUser));
    steamProfile.player = await this.playerService.add({
      personaName: steamProfile.personaname,
      idSteamProfile: steamProfile.id,
    });
    return steamProfile;
  }

  async updateSteamProfile(idSteamProfile: number): Promise<SteamProfile> {
    const steamProfile = await this.steamProfileRepository.findOne(idSteamProfile);
    if (!steamProfile?.steamid) {
      throw new BadRequestException('Steam Profile does not exist');
    }
    await this.steamProfileRepository.update(idSteamProfile, {
      ...(await this.getPlayerSummary(steamProfile.steamid)),
    });
    return await this.steamProfileRepository.findOneOrFail(idSteamProfile);
  }

  async getPlayerSummary(steamid: string): Promise<RawSteamProfile> {
    return this.http
      .get<{ response: { players: SteamProfile[] } }>(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002`,
        {
          params: {
            key: environment.steamKey,
            steamids: steamid,
          },
        }
      )
      .pipe(map(response => response?.data?.response?.players?.[0]))
      .toPromise();
  }

  getRelyingParty(returnUrl = '/steam/auth'): RelyingParty {
    return new RelyingParty('http://localhost:3000/api' + returnUrl, 'http://localhost:3000', true, true, []);
  }

  async openIdUrl(returnUrl: string): Promise<string>;
  async openIdUrl(user: User): Promise<string>;
  async openIdUrl(player: Player): Promise<string>;
  async openIdUrl(): Promise<string>;
  async openIdUrl(urlOrUser?: string | User | Player): Promise<string> {
    let url = '/steam/auth';
    if (urlOrUser) {
      if (isString(urlOrUser)) {
        url = urlOrUser;
      } else {
        const idType = urlOrUser instanceof User ? 'idUser' : 'idPlayer';
        url = `${url}?${idType}=${urlOrUser.id}`;
      }
    }
    const relyingParty = this.getRelyingParty(url);
    return new Promise((resolve, reject) => {
      relyingParty.authenticate(environment.steamOpenIDUrl, false, (error, authUrl) => {
        if (error) return reject('Authentication failed: ' + error);
        if (!authUrl) return reject('Authentication failed.');
        resolve(authUrl);
      });
    });
  }

  async authenticate(req: Request, returnUrl?: string): Promise<RawSteamProfile> {
    return new Promise((resolve, reject) => {
      const relyingParty = this.getRelyingParty((returnUrl ?? '').replace('http://localhost:3000/api', ''));
      relyingParty.verifyAssertion(req, async (error, result) => {
        if (error) return reject(error.message);
        if (!result?.authenticated || !result.claimedIdentifier) {
          return reject('Failed to authenticate user.');
        }
        if (!/^https?:\/\/steamcommunity\.com\/openid\/id\/\d+$/.test(result.claimedIdentifier)) {
          return reject('Claimed identity is not valid.');
        }
        try {
          return resolve(
            await this.getPlayerSummary(result.claimedIdentifier.replace('https://steamcommunity.com/openid/id/', ''))
          );
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  async add(dto: RawSteamProfile, idUser?: number): Promise<SteamProfile> {
    return this.steamProfileRepository.save(new SteamProfile().extendDto({ ...dto, createdBy: idUser ?? -1 }));
  }

  async checkIfSteamProfileIsAlreadyLinked(steamid: string): Promise<SteamProfile | undefined> {
    const steamProfile = await this.steamProfileRepository.findOne({ where: { steamid } });
    if (!steamProfile) {
      return;
    }
    const player = await this.playerService.findByIdSteamProfile(steamProfile.id);
    if (!player) {
      return steamProfile;
    }
    throw new BadRequestException('Steam profile already registered and linked with one player');
  }
}
