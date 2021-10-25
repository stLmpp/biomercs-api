import {
  Body,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthRegisterViewModel } from './auth.view-model';
import {
  AuthChangeForgottenPasswordDto,
  AuthChangePasswordDto,
  AuthCredentialsDto,
  AuthRegisterDto,
  AuthRegisterSteamDto,
} from './auth.dto';
import { HeaderParams, Params } from '../shared/type/params';
import { User } from '../user/user.entity';
import { ApiAuth } from './api-auth.decorator';
import { AuthUser } from './auth-user.decorator';
import { UserService } from '../user/user.service';
import { SteamService } from '../steam/steam.service';
import { Request, Response } from 'express';
import { UserViewModel } from '../user/user.view-model';
import { PlayerService } from '../player/player.service';
import { RateLimit } from 'nestjs-rate-limiter';
import { InjectMapProfile } from '../mapper/inject-map-profile';
import { MapProfile } from '../mapper/map-profile';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private steamService: SteamService,
    private playerService: PlayerService,
    @InjectMapProfile(User, UserViewModel) private mapProfile: MapProfile<User, UserViewModel>
  ) {}

  @RateLimit({
    keyPrefix: 'auth/register',
    points: 3,
    duration: 15 * 60,
    errorMessage: 'Wait a while before trying to register again',
  })
  @Post('register')
  async register(@Body() dto: AuthRegisterDto): Promise<AuthRegisterViewModel> {
    return this.authService.register(dto);
  }

  @ApiOkResponse()
  @Post('login')
  async login(@Body() dto: AuthCredentialsDto): Promise<UserViewModel> {
    return this.mapProfile.map(await this.authService.login(dto));
  }

  @ApiOkResponse()
  @ApiAuth()
  @Post('auto-login')
  async autoLogin(@AuthUser() user: User): Promise<UserViewModel> {
    if (user.id === -1) {
      throw new UnauthorizedException();
    }
    const newUser = await this.userService.update(user.id, { lastOnline: new Date() });
    if (!newUser) {
      throw new NotFoundException('User not found');
    }
    newUser.token = await this.authService.getToken(user);
    return this.mapProfile.map(newUser);
  }

  @Post(`user/:${Params.idUser}/resend-code`)
  async resendConfirmationCode(@Param(Params.idUser) idUser: number): Promise<void> {
    return this.authService.resendConfirmationCode(idUser);
  }

  @Post(`user/:${Params.idUser}/confirm-code/:${Params.confirmationCode}`)
  async confirmCode(
    @Param(Params.idUser) idUser: number,
    @Param(Params.confirmationCode) confirmationCode: number
  ): Promise<UserViewModel> {
    return this.mapProfile.map(await this.authService.confirmCode(idUser, confirmationCode));
  }

  @ApiQuery({ name: Params.email, required: false })
  @ApiQuery({ name: Params.username, required: false })
  @Get(`user/exists`)
  async userExists(@Query(Params.email) email?: string, @Query(Params.username) username?: string): Promise<boolean> {
    return (
      (await this.userService.anyByEmailOrUsername(username, email)) ||
      (!!username && (await this.playerService.personaNameExistsWithoutUser(username)))
    );
  }

  @ApiOkResponse()
  @Post(`steam/login/:${Params.uuid}`)
  async loginSteam(@Param(Params.uuid) uuid: string): Promise<string> {
    return this.steamService.openIdUrl(`/auth/steam/login/${uuid}/return`);
  }

  @Get(`steam/login/:${Params.uuid}/return`)
  async loginSteamReturn(
    @Req() req: Request,
    @Res() res: Response,
    @Query(Params.openidReturnTo) returnUrl: string,
    @Param(Params.uuid) uuid: string
  ): Promise<void> {
    const steamProfile = await this.steamService.authenticate(req, returnUrl);
    await this.authService.authSteam(steamProfile.steamid, uuid);
    res.send(`Logged successfully! You can close this window, if it's not closed automatically`);
  }

  @RateLimit({
    keyPrefix: 'auth/steam/register',
    points: 3,
    duration: 15 * 60,
    errorMessage: 'Wait a while before trying to register again',
  })
  @Post(`steam/register`)
  async registerSteam(
    @Body() dto: AuthRegisterSteamDto,
    @Headers(HeaderParams.authorizationSteam) auth: string
  ): Promise<AuthRegisterViewModel> {
    return this.authService.registerSteam(dto, auth);
  }

  @ApiOkResponse()
  @Post(`steam/:${Params.steamid}/validate-token`)
  async validateSteamToken(
    @Param(Params.steamid) steamid: string,
    @Headers(HeaderParams.authorizationSteam) token: string
  ): Promise<boolean> {
    return this.authService.validateSteamToken(steamid, token);
  }

  @ApiOkResponse()
  @Post('forgot-password')
  async sendForgotPasswordConfirmationCode(@Query(Params.email) email: string): Promise<void> {
    return this.authService.sendForgotPasswordConfirmationCode(email);
  }

  @Post('forgot-password/change-password')
  async changeForgottenPassword(@Body() dto: AuthChangeForgottenPasswordDto): Promise<UserViewModel> {
    return this.mapProfile.map(await this.authService.changeForgottenPassword(dto));
  }

  @ApiAuth()
  @Post('change-password')
  async sendChangePasswordConfirmationCode(@AuthUser() user: User): Promise<void> {
    await this.authService.sendChangePasswordConfirmationCode(user.id);
  }

  @ApiAuth()
  @Post('change-password/confirm')
  async confirmChangePassword(@AuthUser() user: User, @Body() dto: AuthChangePasswordDto): Promise<UserViewModel> {
    return this.mapProfile.map(await this.authService.confirmCodeAndChangePassword(user.id, dto));
  }

  @ApiAuth()
  @Get(`change-password/validate/:${Params.key}`)
  async validateChangePassword(@Param(Params.key) key: string, @AuthUser() user: User): Promise<boolean> {
    const payload = this.authService.validateChangePassword(key);
    return payload?.idUser === user.id;
  }

  @Get(`dev/get-token`)
  async devGetToken(): Promise<string> {
    return this.authService.devGetToken();
  }
}
