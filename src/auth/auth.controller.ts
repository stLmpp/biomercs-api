import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthRegisterViewModel } from './auth.view-model';
import { AuthChangePasswordDto, AuthCredentialsDto, AuthRegisterDto } from './auth.dto';
import { RouteParamEnum } from '../shared/type/route-param.enum';
import { User } from '../user/user.entity';
import { ApiAuth } from './api-auth.decorator';
import { AuthUser } from './auth-user.decorator';
import { UserService } from '../user/user.service';
import { SteamService } from '../steam/steam.service';
import { Request, Response } from 'express';
import { environment } from '../environment/environment';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService, private steamService: SteamService) {}

  @Post('register')
  async register(@Body() dto: AuthRegisterDto): Promise<AuthRegisterViewModel> {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: AuthCredentialsDto): Promise<User> {
    return this.authService.login(dto);
  }

  @ApiAuth()
  @Post('auto-login')
  async autoLogin(@AuthUser() user: User): Promise<User> {
    if (user.id === -1) {
      throw new UnauthorizedException();
    }
    const newUser = await this.userService.getById(user.id);
    if (!newUser) {
      throw new NotFoundException('User not found');
    }
    newUser.token = await this.authService.getToken(user);
    return newUser.removePasswordAndSalt();
  }

  @Post(`user/:${RouteParamEnum.idUser}/resend-code`)
  async resendConfirmationCode(@Param(RouteParamEnum.idUser) idUser: number): Promise<void> {
    return this.authService.resendConfirmationCode(idUser);
  }

  @Post(`user/:${RouteParamEnum.idUser}/confirm-code/:${RouteParamEnum.confirmationCode}`)
  async confirmCode(
    @Param(RouteParamEnum.idUser) idUser: number,
    @Param(RouteParamEnum.confirmationCode) confirmationCode: number
  ): Promise<User> {
    return this.authService.confirmCode(idUser, confirmationCode);
  }

  @Post(`login-steam/:${RouteParamEnum.uuid}`)
  async loginSteam(@Param(RouteParamEnum.uuid) uuid: string): Promise<string> {
    return this.steamService.openIdUrl(`/auth/login-steam/${uuid}/return`);
  }

  @Get(`login-steam/:${RouteParamEnum.uuid}/return`)
  async loginSteamReturn(
    @Req() req: Request,
    @Res() res: Response,
    @Query(RouteParamEnum.openidReturnTo) returnUrl: string,
    @Param(RouteParamEnum.uuid) uuid: string
  ): Promise<void> {
    const steamProfile = await this.steamService.authenticate(req, returnUrl);
    await this.authService.authSteam(steamProfile.steamid, uuid);
    res.redirect(environment.frontEndUrl + '/auth/validate-login-steam');
  }

  @Post('forgot-password')
  async sendForgotPasswordConfirmationCode(@Query(RouteParamEnum.email) email: string): Promise<number> {
    return this.authService.sendForgotPasswordConfirmationCode(email);
  }

  @Post(`user/:${RouteParamEnum.idUser}/forgot-password/:${RouteParamEnum.confirmationCode}`)
  async confirmForgotPassword(
    @Param(RouteParamEnum.idUser) idUser: number,
    @Param(RouteParamEnum.confirmationCode) confirmationCode: number
  ): Promise<boolean> {
    return this.authService.confirmForgotPassword(idUser, confirmationCode);
  }

  @Post(`user/:${RouteParamEnum.idUser}/change-password`)
  async changePassword(
    @Param(RouteParamEnum.idUser) idUser: number,
    @Body() dto: AuthChangePasswordDto
  ): Promise<User> {
    return this.authService.changePassword(idUser, dto.confirmationCode, dto.password);
  }
}
