import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './user.entity';
import { RouteParamEnum } from '../shared/type/route-param.enum';
import { UserUpdateDto } from './user.dto';
import { ApiAuth } from '../auth/api-auth.decorator';
import { CreatedByPipe } from '../auth/created-by.pipe';

@ApiAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Patch(`:${RouteParamEnum.idUser}`)
  async update(@Param(RouteParamEnum.idUser) idUser: number, @Body(CreatedByPipe) dto: UserUpdateDto): Promise<User> {
    return this.userService.update(idUser, dto);
  }
}
