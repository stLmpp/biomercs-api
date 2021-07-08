import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthChangePasswordDto, AuthCredentialsDto, AuthRegisterDto, AuthRegisterSteamDto } from './auth.dto';
import { UserAddDto } from '../user/user.dto';
import { genSalt, hash } from 'bcryptjs';
import { AuthRegisterViewModel, AuthSteamLoginSocketErrorType } from './auth.view-model';
import { isNumber } from 'st-utils';
import { AuthConfirmationService } from './auth-confirmation/auth-confirmation.service';
import { User } from '../user/user.entity';
import { environment } from '../environment/environment';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { PlayerService } from '../player/player.service';
import { AuthGateway } from './auth.gateway';
import { SteamService } from '../steam/steam.service';
import { random } from '../util/util';
import { MailService } from '../mail/mail.service';
import { MailPriorityEnum } from '../mail/mail-priority.enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private authConfirmationService: AuthConfirmationService,
    private jwtService: JwtService,
    private playerService: PlayerService,
    private authGateway: AuthGateway,
    private steamService: SteamService,
    private mailService: MailService
  ) {}

  private _mapUserLoginAttempts = new Map<number, number | null>();

  private async _sendConfirmationCodeEmail(user: User): Promise<void> {
    const { email, id } = user;
    const authConfirmation = await this.authConfirmationService.generateConfirmationCode(user);
    await this.userService.update(id, { idCurrentAuthConfirmation: authConfirmation.id });
    await this.mailService.sendMailInfo(
      {
        to: email,
        subject: 'Biomercs - Confirmation code',
      },
      {
        title: 'Confirmation code',
        info: [{ title: 'Code', value: authConfirmation.code }],
      },
      MailPriorityEnum.now
    );
  }

  private async _registerUser({ username, password, email }: AuthRegisterDto): Promise<User> {
    let user = await this.userService.getByEmailOrUsername(username, email);
    if (user) {
      throw new ConflictException('User or e-mail already registered');
    }
    const salt = await genSalt();
    const hashPassword = await hash(password, salt);
    const dto = new UserAddDto({
      username,
      email,
      password: hashPassword,
      lastOnline: new Date(),
      rememberMe: false,
      salt,
    });
    user = await this.userService.add(dto);
    await this._sendConfirmationCodeEmail(user);
    return user;
  }

  @Transactional()
  async register(dto: AuthRegisterDto): Promise<AuthRegisterViewModel> {
    const user = await this._registerUser(dto);
    await this.playerService.add({ idUser: user.id, personaName: user.username });
    return { email: user.email, message: 'User created! Please confirm your e-mail', idUser: user.id };
  }

  @Transactional()
  async resendConfirmationCode(userOrIdUser: number | User): Promise<void> {
    const user = isNumber(userOrIdUser) ? await this.userService.getById(userOrIdUser) : userOrIdUser;
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.idCurrentAuthConfirmation) {
      await this.authConfirmationService.invalidateCode(user.idCurrentAuthConfirmation);
    }
    await this._sendConfirmationCodeEmail(user);
  }

  @Transactional()
  async confirmCode(idUser: number, code: number): Promise<User> {
    const user = await this.userService.getById(idUser);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.idCurrentAuthConfirmation) {
      throw new BadRequestException('User is not waiting for confirmation');
    }
    await this.authConfirmationService.confirmCode(user.idCurrentAuthConfirmation, code);
    const { password, salt } = await this.userService.getPasswordAndSalt(idUser);
    user.password = password;
    user.salt = salt;
    user.token = await this.getToken(user);
    user.lastOnline = new Date();
    await this.userService.update(idUser, { lastOnline: user.lastOnline, idCurrentAuthConfirmation: null });
    return user;
  }

  @Transactional()
  async changeForgottenPassword(dto: AuthChangePasswordDto): Promise<User> {
    let user = await this.userService.findByAuthCode(dto.confirmationCode);
    if (!user?.idCurrentAuthConfirmation) {
      throw new BadRequestException('Confirmation code does not exists');
    }
    await this.authConfirmationService.confirmCode(user.idCurrentAuthConfirmation, dto.confirmationCode);
    const { salt } = await this.userService.getPasswordAndSalt(user.id);
    const newPasswordHash = await hash(dto.password, salt);
    user = await this.userService.updatePasswordAndRemoveLocks(user.id, newPasswordHash);
    return this.login({ username: user.username, password: dto.password, rememberMe: true });
  }

  @Transactional()
  async sendForgotPasswordConfirmationCode(email: string): Promise<void> {
    const user = await this.userService.getByEmailOrUsername(undefined, email);
    if (user) {
      if (user.bannedDate) {
        throw new ForbiddenException('This account is locked');
      }
      if (user.idCurrentAuthConfirmation) {
        await Promise.all([
          await this.authConfirmationService.invalidateCode(user.idCurrentAuthConfirmation),
          await this.userService.update(user.id, { idCurrentAuthConfirmation: null }),
        ]);
      }
      await this._sendConfirmationCodeEmail(user);
    }
  }

  @Transactional()
  async authSteam(steamid: string, uuid: string): Promise<void> {
    const user = await this.userService.getBySteamid(steamid);
    if (!user) {
      this.authGateway.sendTokenSteam({
        uuid,
        token: await hash(steamid, await environment.envSalt()),
        error: 'This steam has no user linked to it',
        steamid,
        errorType: AuthSteamLoginSocketErrorType.userNotFound,
      });
      return;
    }
    if (!user.canLogin()) {
      let error = `This user can't login`;
      let errorType = AuthSteamLoginSocketErrorType.unknown;
      if (user.bannedDate) {
        errorType = AuthSteamLoginSocketErrorType.userBanned;
      }
      if (user.lockedDate) {
        error = `This account is locked`;
        errorType = AuthSteamLoginSocketErrorType.userLocked;
      }
      this.authGateway.sendTokenSteam({
        uuid,
        token: await hash(steamid, await environment.envSalt()),
        error,
        steamid,
        errorType,
      });
      return;
    }
    if (user.idCurrentAuthConfirmation) {
      await this.resendConfirmationCode(user);
      this.authGateway.sendTokenSteam({
        uuid,
        errorType: AuthSteamLoginSocketErrorType.userNotConfirmed,
        error: 'Account already exists, but it needs to be confirmed.',
        steamid,
        token: await hash(steamid, await environment.envSalt()),
        idUser: user.id,
      });
      return;
    }
    const { salt, password } = await this.userService.getPasswordAndSalt(user.id);
    user.token = await this.getToken(new User().extendDto({ ...user, password, salt }));
    user.lastOnline = new Date();
    user.rememberMe = true;
    await this.userService.update(user.id, { lastOnline: user.lastOnline, rememberMe: user.rememberMe });
    this._mapUserLoginAttempts.set(user.id, null);
    this.authGateway.sendTokenSteam({ uuid, token: user.token });
  }

  @Transactional()
  async registerSteam({ email, steamid }: AuthRegisterSteamDto, auth: string): Promise<AuthRegisterViewModel> {
    const envSalt = await environment.envSalt();
    const hashed = await hash(steamid, envSalt);
    if (hashed !== auth) {
      throw new UnauthorizedException();
    }
    const steamProfile = await this.steamService.createWithPlayer(steamid);
    const password = '' + random(100_000_000_000, 999_999_999_999);
    const user = await this._registerUser({ email, username: steamProfile.personaname, password });
    await this.playerService.updateIdUser(steamProfile.player.id, user.id);
    return { email: user.email, message: 'User created! Please confirm your e-mail', idUser: user.id };
  }

  /**
   * @description Not transactional because the e-mail must be sent.
   * Also there's no need for this method to be transactional, since there's only one update that matters
   */
  async login(dto: AuthCredentialsDto): Promise<User> {
    const [user, error] = await this.userService.validateUserToLogin(dto);
    if (!user) {
      throw error;
    }
    if (error) {
      if (error instanceof UnauthorizedException) {
        const attempts = this._mapUserLoginAttempts.get(user.id) ?? 1;
        if (attempts >= 3) {
          await this.userService.lockUser(user.id);
        } else {
          this._mapUserLoginAttempts.set(user.id, attempts + 1);
        }
      }
      throw error;
    }
    const hasConfirmationPending = user.idCurrentAuthConfirmation;
    if (hasConfirmationPending) {
      await this.resendConfirmationCode(user);
      throw new PreconditionFailedException({ message: 'Account not confirmed', extra: user.id });
    }
    user.lastOnline = new Date();
    user.rememberMe = dto.rememberMe ?? false;
    await this.userService.update(user.id, { lastOnline: user.lastOnline, rememberMe: user.rememberMe });
    user.token = await this.getToken(user);
    this._mapUserLoginAttempts.set(user.id, null);
    return user;
  }

  async getToken({ id, password, rememberMe }: User): Promise<string> {
    const options: JwtSignOptions = {};
    if (rememberMe) {
      options.expiresIn = '180 days';
    }
    return await this.jwtService.signAsync({ id, password }, options);
  }

  async validateSteamToken(steamid: string, token: string): Promise<boolean> {
    const envSalt = await environment.envSalt();
    const hashed = await hash(steamid, envSalt);
    return hashed === token;
  }
}
