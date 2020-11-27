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
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
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
  async login(@Body() dto: AuthCredentialsDto): Promise<User> {
    return this.authService.login(dto);
  }

  @HttpCode(200)
  @ApiAuth()
  @Post('auto-login')
  async autoLogin(@AuthUser() user: User): Promise<User> {
    if (user.id === -1) {
      throw new UnauthorizedException();
    }
    const newUser = await this.userService.update(user.id, { lastOnline: new Date() });
    if (!newUser) {
      throw new NotFoundException('User not found');
    }
    newUser.token = await this.authService.getToken(user);
    return newUser.removePasswordAndSalt();
  }

  @Post(`user/:${Params.idUser}/resend-code`)
  async resendConfirmationCode(@Param(Params.idUser) idUser: number): Promise<void> {
    return this.authService.resendConfirmationCode(idUser);
  }

  @Post(`user/:${Params.idUser}/confirm-code/:${Params.confirmationCode}`)
  async confirmCode(
    @Param(Params.idUser) idUser: number,
    @Param(Params.confirmationCode) confirmationCode: number
  ): Promise<User> {
    return this.authService.confirmCode(idUser, confirmationCode);
  }

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
    res.send('Logged succesfully!');
  }

  @Post(`steam/register`)
  async registerSteam(
    @Body() dto: AuthRegisterSteamDto,
    @Headers(HeaderParams.authorizationSteam) auth: string
  ): Promise<AuthRegisterViewModel> {
    return this.authService.registerSteam(dto, auth);
  }

  @Post(`steam/:${Params.steamid}/validate-token`)
  async validateSteamToken(
    @Param(Params.steamid) steamid: string,
    @Headers(HeaderParams.authorizationSteam) token: string
  ): Promise<boolean> {
    return this.authService.validateSteamToken(steamid, token);
  }

  @Post('forgot-password')
  async sendForgotPasswordConfirmationCode(@Query(Params.email) email: string): Promise<void> {
    return this.authService.sendForgotPasswordConfirmationCode(email);
  }

  @Post(`forgot-password/change-password`)
  async changeForgottenPassword(@Body() dto: AuthChangePasswordDto): Promise<User> {
    return this.authService.changeForgottenPassword(dto);
  }
}
