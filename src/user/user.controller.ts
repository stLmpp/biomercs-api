import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserUpdateDto } from './user.dto';
import { ApiAuth } from '../auth/api-auth.decorator';
import { Params } from '../shared/type/params';

@ApiAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Patch(`:${Params.idUser}`)
  async update(@Param(Params.idUser) idUser: number, @Body() dto: UserUpdateDto): Promise<User> {
    return this.userService.update(idUser, dto);
  }
}
