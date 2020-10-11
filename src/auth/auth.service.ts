import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthCredentialsDto, AuthRegisterDto } from './auth.dto';
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

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private authConfirmationService: AuthConfirmationService,
    private mailerService: MailerService,
    private jwtService: JwtService
  ) {}

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
    await this.sendConfirmationCodeEmail(userCreated);
    return { email, message: 'User created! Please confirm your e-mail', idUser: userCreated.id };
  }

  @Transactional()
  async resendConfirmationCode(idUser: number): Promise<void> {
    const user = await this.userService.getById(idUser);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.authConfirmationService.invalidateLastCode(idUser);
    await this.sendConfirmationCodeEmail(user);
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

  async getToken({ id, password, rememberMe }: User): Promise<string> {
    const options: JwtSignOptions = {};
    if (rememberMe) {
      options.expiresIn = '180 days';
    }
    return await this.jwtService.signAsync({ id, password }, options);
  }

  private async sendConfirmationCodeEmail({ email, id }: User): Promise<void> {
    const code = await this.generateConfirmationCode(id);
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

  private async generateConfirmationCode(idUser: number): Promise<number> {
    const code = random(100000, 999999);
    if (await this.authConfirmationService.exists(idUser, code)) {
      return this.generateConfirmationCode(idUser);
    }
    await this.authConfirmationService.add({ idUser, code, expirationDate: addDays(new Date(), 1) });
    return code;
  }
}
