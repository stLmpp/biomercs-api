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
import {
  AuthChangeForgottenPasswordDto,
  AuthChangePasswordDto,
  AuthChangePasswordKey,
  AuthCredentialsDto,
  AuthRegisterDto,
  AuthRegisterSteamDto,
} from './auth.dto';
import { UserAddDto } from '../user/user.dto';
import { genSalt, hash } from 'bcrypt';
import {
  AuthRegisterViewModel,
  AuthSteamLoginSocketErrorType,
  AuthSteamValidateNamesViewModel,
} from './auth.view-model';
import { isNumber } from 'st-utils';
import { AuthConfirmationService } from './auth-confirmation/auth-confirmation.service';
import { User } from '../user/user.entity';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { PlayerService } from '../player/player.service';
import { AuthGateway } from './auth.gateway';
import { SteamService } from '../steam/steam.service';
import { MailService } from '../mail/mail.service';
import { MailPriorityEnum } from '../mail/mail-priority.enum';
import { EncryptorService } from '../encryptor/encryptor.service';
import { Environment } from '../environment/environment';
import { v4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private authConfirmationService: AuthConfirmationService,
    private jwtService: JwtService,
    private playerService: PlayerService,
    private authGateway: AuthGateway,
    private steamService: SteamService,
    private mailService: MailService,
    private encryptorService: EncryptorService,
    private environment: Environment
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
      await this.userService.update(user.id, { idCurrentAuthConfirmation: null });
      await this.authConfirmationService.invalidateCode(user.idCurrentAuthConfirmation);
      user.idCurrentAuthConfirmation = null;
    }
    await this._sendConfirmationCodeEmail(user);
  }

  @Transactional()
  async confirmCode(idUser: number, code: number): Promise<User> {
    const user = await this.userService.findByIdWithPasswordAndSaltOrFail(idUser);
    if (!user.idCurrentAuthConfirmation) {
      throw new BadRequestException('User is not waiting for confirmation');
    }
    await this.authConfirmationService.confirmCode(user.idCurrentAuthConfirmation, code);
    user.token = await this.getToken(user);
    user.lastOnline = new Date();
    await this.userService.update(idUser, { lastOnline: user.lastOnline, idCurrentAuthConfirmation: null });
    return user;
  }

  @Transactional()
  async changeForgottenPassword(dto: AuthChangeForgottenPasswordDto): Promise<User> {
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
  async sendChangePasswordConfirmationCode(idUser: number): Promise<void> {
    const user = await this.userService.getById(idUser);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const authConfirmation = await this.authConfirmationService.generateConfirmationCodeAndInvalidLast(user.id);
    const payload: AuthChangePasswordKey = { idUser, idAuthConfirmation: authConfirmation.id };
    const payloadString = JSON.stringify(payload);
    await this.mailService.sendMailInfo(
      { to: user.email, subject: 'Biomercs - Change password' },
      {
        title: 'Change password',
        info: [
          {
            title: 'Code',
            value: authConfirmation.code,
          },
          {
            title: 'Link to change password',
            value:
              this.environment.frontEndUrl +
              `/auth/change-password/confirm/${this.encryptorService.encrypt(payloadString)}`,
          },
        ],
      },
      MailPriorityEnum.now
    );
  }

  @Transactional()
  async confirmCodeAndChangePassword(
    idUser: number,
    { confirmationCode, newPassword, oldPassword, key }: AuthChangePasswordDto
  ): Promise<User> {
    if (oldPassword === newPassword) {
      throw new BadRequestException(`The new password is equal to the old password`);
    }
    const payload = this.validateChangePassword(key);
    if (!payload) {
      throw new BadRequestException('Wrong key');
    }
    if (idUser !== payload.idUser) {
      throw new ForbiddenException();
    }
    const user = await this.userService.findByIdWithPasswordAndSaltOrFail(idUser);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isOldPasswordValid = await user.validatePassword(oldPassword);
    if (!isOldPasswordValid) {
      throw new BadRequestException(`Old password is incorrect`);
    }
    await this.authConfirmationService.confirmCode(payload.idAuthConfirmation, confirmationCode);
    const newPasswordHash = await hash(newPassword, user.salt);
    await this.userService.updatePasswordAndRemoveLocks(user.id, newPasswordHash);
    return this.login({ username: user.username, password: newPassword, rememberMe: true });
  }

  @Transactional()
  async authSteam(steamid: string, uuid: string): Promise<void> {
    const user = await this.userService.getBySteamid(steamid);
    if (!user) {
      this.authGateway.sendTokenSteam({
        uuid,
        token: await hash(steamid, await this.environment.envSalt()),
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
        token: await hash(steamid, await this.environment.envSalt()),
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
        token: await hash(steamid, await this.environment.envSalt()),
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
  async registerSteam({ email, steamid, newName }: AuthRegisterSteamDto, auth: string): Promise<AuthRegisterViewModel> {
    const envSalt = await this.environment.envSalt();
    const hashed = await hash(steamid, envSalt);
    if (hashed !== auth) {
      throw new UnauthorizedException();
    }
    const steamprofileRaw = await this.steamService.getPlayerSummary(steamid);
    const [playerExists, userExists] = await Promise.all([
      this.playerService.personaNameExists(steamprofileRaw.personaname),
      this.userService.anyByEmailOrUsername(steamprofileRaw.personaname),
    ]);
    if ((playerExists || userExists) && !newName) {
      throw new BadRequestException('newName is required');
    }
    const steamProfile = await this.steamService.createWithPlayer(steamid, false, playerExists ? newName : undefined);
    const password = v4();
    const user = await this._registerUser({
      email,
      username: userExists ? newName! : steamProfile.personaname.substr(0, 100),
      password,
    });
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

  async devGetToken(): Promise<string> {
    if (this.environment.production) {
      throw new ForbiddenException('NOT');
    }
    const owner = await this.userService.findOwnerWithPasswordAndSalt();
    return this.getToken(owner);
  }

  async validateSteamToken(steamid: string, token: string): Promise<boolean> {
    const envSalt = await this.environment.envSalt();
    const hashed = await hash(steamid, envSalt);
    return hashed === token;
  }

  async validateSteamNames(steamid: string): Promise<AuthSteamValidateNamesViewModel> {
    const steamprofile = await this.steamService.getPlayerSummary(steamid);
    if (!steamprofile) {
      throw new NotFoundException('Steam profile not found');
    }
    const [playerExists, userExists] = await Promise.all([
      this.playerService.personaNameExists(steamprofile.personaname),
      this.userService.anyByEmailOrUsername(steamprofile.personaname),
    ]);
    return { steamPersonaName: steamprofile.personaname, newName: playerExists || userExists };
  }

  validateChangePassword(key: string): AuthChangePasswordKey | null {
    const decrypted = this.encryptorService.decrypt(key);
    if (!decrypted) {
      return null;
    }
    let payload: AuthChangePasswordKey;
    try {
      payload = JSON.parse(decrypted);
    } catch {
      return null;
    }
    return payload;
  }
}
