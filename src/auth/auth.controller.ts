import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
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
import { AuthChangePasswordDto, AuthCredentialsDto, AuthRegisterDto, AuthRegisterSteamDto } from './auth.dto';
import { HeaderParams, Params } from '../shared/type/params';
import { User } from '../user/user.entity';
import { ApiAuth } from './api-auth.decorator';
import { AuthUser } from './auth-user.decorator';
import { UserService } from '../user/user.service';
import { SteamService } from '../steam/steam.service';
import { Request, Response } from 'express';
import { UserViewModel } from '../user/user.view-model';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService, private steamService: SteamService) {}

  @Post('register')
  async register(@Body() dto: AuthRegisterDto): Promise<AuthRegisterViewModel> {
    return this.authService.register(dto);
  }

  @ApiOkResponse()
  @Post('login')
  async login(@Body() dto: AuthCredentialsDto): Promise<UserViewModel> {
    return this.authService.login(dto);
  }

  @HttpCode(200)
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
    return newUser;
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
    return this.authService.confirmCode(idUser, confirmationCode);
  }

  @ApiQuery({ name: Params.email, required: false })
  @ApiQuery({ name: Params.username, required: false })
  @Get(`user/exists`)
  async userExists(@Query(Params.email) email?: string, @Query(Params.username) username?: string): Promise<boolean> {
    return this.userService.anyByEmailOrUsername(username, email);
  }

  @HttpCode(200)
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
    res.send(`Logged succesfully! You can close this window, if it's not closed automatically`);
  }

  @Post(`steam/register`)
  async registerSteam(
    @Body() dto: AuthRegisterSteamDto,
    @Headers(HeaderParams.authorizationSteam) auth: string
  ): Promise<AuthRegisterViewModel> {
    return this.authService.registerSteam(dto, auth);
  }

  @HttpCode(200)
  @Post(`steam/:${Params.steamid}/validate-token`)
  async validateSteamToken(
    @Param(Params.steamid) steamid: string,
    @Headers(HeaderParams.authorizationSteam) token: string
  ): Promise<boolean> {
    return this.authService.validateSteamToken(steamid, token);
  }

  @HttpCode(200)
  @Post('forgot-password')
  async sendForgotPasswordConfirmationCode(@Query(Params.email) email: string): Promise<void> {
    return this.authService.sendForgotPasswordConfirmationCode(email);
  }

  @Post(`forgot-password/change-password`)
  async changeForgottenPassword(@Body() dto: AuthChangePasswordDto): Promise<UserViewModel> {
    return this.authService.changeForgottenPassword(dto);
  }
}
