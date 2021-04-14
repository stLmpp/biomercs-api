import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserUpdateDto } from './user.dto';
import { ApiAuth } from '../auth/api-auth.decorator';
import { Params } from '../shared/type/params';
import { UserViewModel } from './user.view-model';

@ApiAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Patch(`:${Params.idUser}`)
  async update(@Param(Params.idUser) idUser: number, @Body() dto: UserUpdateDto): Promise<UserViewModel> {
    return this.userService.update(idUser, dto);
  }
}
