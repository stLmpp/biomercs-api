import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthChangePasswordDto, AuthCredentialsDto, AuthRegisterDto } from './auth.dto';
import { UserAddDto } from '../user/user.dto';
import { genSalt, hash } from 'bcryptjs';
import { AuthRegisterViewModel } from './auth.view-model';
import { random } from 'lodash';
import { AuthConfirmationService } from './auth-confirmation/auth-confirmation.service';
import { addDays } from 'date-fns';
import { User } from '../user/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { environment } from '../environment/environment';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { PlayerService } from '../player/player.service';
import { AuthGateway } from './auth.gateway';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private authConfirmationService: AuthConfirmationService,
    private mailerService: MailerService,
    private jwtService: JwtService,
    private playerService: PlayerService,
    private authGateway: AuthGateway
  ) {}

  private async _sendConfirmationCodeEmail({ email, id }: User): Promise<void> {
    const code = await this._generateConfirmationCode(id);
    await this.mailerService.sendMail({
      to: email,
      from: environment.get('MAIL'),
      subject: 'Biomercs - Confirmation code',
      template: 'confirmation-code',
      context: {
        code,
        version: environment.appVersion,
        year: new Date().getFullYear(),
      },
    });
  }

  private async _generateConfirmationCode(idUser: number): Promise<number> {
    const code = random(100000, 999999);
    if (await this.authConfirmationService.exists(idUser, code)) {
      return this._generateConfirmationCode(idUser);
    }
    await this.authConfirmationService.add({ idUser, code, expirationDate: addDays(new Date(), 1) });
    return code;
  }

  @Transactional()
  async register({ email, username, password }: AuthRegisterDto): Promise<AuthRegisterViewModel> {
    const user = await this.userService.getByEmailOrUsername(username, email);
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
    const userCreated = await this.userService.add(dto);
    await this.playerService.add({ idUser: userCreated.id, personaName: userCreated.username });
    await this._sendConfirmationCodeEmail(userCreated);
    return { email, message: 'User created! Please confirm your e-mail', idUser: userCreated.id };
  }

  @Transactional()
  async resendConfirmationCode(idUser: number): Promise<void> {
    const user = await this.userService.getById(idUser);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.authConfirmationService.invalidateLastCode(idUser);
    await this._sendConfirmationCodeEmail(user);
  }

  @Transactional()
  async confirmCode(idUser: number, code: number): Promise<User> {
    const user = await this.userService.getById(idUser);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.authConfirmationService.confirmCode(idUser, code);
    const { password, salt } = await this.userService.getPasswordAndSalt(idUser);
    user.password = password;
    user.salt = salt;
    user.token = await this.getToken(user);
    user.lastOnline = new Date();
    await this.userService.update(idUser, { lastOnline: user.lastOnline });
    return user.removePasswordAndSalt();
  }

  @Transactional()
  async login(dto: AuthCredentialsDto): Promise<User> {
    const user = await this.userService.validateUserToLogin(dto);
    const hasConfirmationPending = await this.authConfirmationService.exists(user.id);
    if (hasConfirmationPending) {
      throw new UnauthorizedException('Account not confirmed');
    }
    user.lastOnline = new Date();
    user.rememberMe = dto.rememberMe ?? false;
    await this.userService.update(user.id, { lastOnline: user.lastOnline, rememberMe: user.rememberMe });
    user.token = await this.getToken(user);
    return user.removePasswordAndSalt();
  }

  @Transactional()
  async changeForgottenPassword(dto: AuthChangePasswordDto): Promise<User> {
    let user = await this.userService.findByAuthCode(dto.confirmationCode);
    if (!user) {
      throw new BadRequestException('Confirmation code does not exists');
    }
    await this.authConfirmationService.confirmCode(user.id, dto.confirmationCode);
    const { salt } = await this.userService.getPasswordAndSalt(user.id);
    const newPasswordHash = await hash(dto.password, salt);
    user = await this.userService.updatePassword(user.id, newPasswordHash);
    return this.login({ username: user.username, password: dto.password, rememberMe: true });
  }

  @Transactional()
  async sendForgotPasswordConfirmationCode(email: string): Promise<void> {
    const user = await this.userService.getByEmailOrUsername(undefined, email);
    if (user) {
      await this._sendConfirmationCodeEmail(user);
    }
  }

  @Transactional()
  async authSteam(steamid: string, uuid: string): Promise<User> {
    const user = await this.userService.getBySteamid(steamid);
    if (!user) {
      this.authGateway.sendTokenSteam(uuid, '', 'This steam has no user linked to it');
      throw new UnauthorizedException('This steam has no user linked to it');
    }
    const { salt, password } = await this.userService.getPasswordAndSalt(user.id);
    user.token = await this.getToken(new User().extendDto({ ...user, password, salt }));
    user.lastOnline = new Date();
    user.rememberMe = true;
    await this.userService.update(user.id, { lastOnline: user.lastOnline, rememberMe: user.rememberMe });
    this.authGateway.sendTokenSteam(uuid, user.token);
    return user;
  }

  async getToken({ id, password, rememberMe }: User): Promise<string> {
    const options: JwtSignOptions = {};
    if (rememberMe) {
      options.expiresIn = '180 days';
    }
    return await this.jwtService.signAsync({ id, password }, options);
  }

  async confirmForgotPassword(idUser: number, code: number): Promise<boolean> {
    return this.authConfirmationService.exists(idUser, code);
  }
}
