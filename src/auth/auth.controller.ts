import { Body, Controller, NotFoundException, Param, Post, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthRegisterViewModel } from './auth.view-model';
import { AuthCredentialsDto, AuthRegisterDto } from './auth.dto';
import { RouteParamEnum } from '../shared/type/route-param.enum';
import { User } from '../user/user.entity';
import { ApiAuth } from './api-auth.decorator';
import { AuthUser } from './auth-user.decorator';
import { UserService } from '../user/user.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

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
}
