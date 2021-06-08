import { Body, Controller, Get, Param, Patch, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserUpdateDto } from './user.dto';
import { ApiAuth } from '../auth/api-auth.decorator';
import { Params } from '../shared/type/params';
import { UserViewModel } from './user.view-model';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiPagination } from '../shared/decorator/api-pagination';

@ApiAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Patch(`:${Params.idUser}`)
  async update(@Param(Params.idUser) idUser: number, @Body() dto: UserUpdateDto): Promise<UserViewModel> {
    return this.userService.update(idUser, dto);
  }

  @ApiAdmin()
  @Put(`:${Params.idUser}/ban`)
  async banUser(@Param(Params.idUser) idUser: number): Promise<void> {
    await this.userService.banUser(idUser);
  }

  @ApiAdmin()
  @Put(`:${Params.idUser}/unban`)
  async unbanUser(@Param(Params.idUser) idUser: number): Promise<void> {
    await this.userService.unbanUser(idUser);
  }

  @ApiAdmin()
  @ApiPagination(UserViewModel)
  @Get('search')
  async search(
    @Query(Params.usernameOrEmail) usernameOrEmail: string,
    @Query(Params.page) page: number,
    @Query(Params.limit) limit: number
  ): Promise<Pagination<UserViewModel>> {
    return this.userService.findByUsernameOrEmail(usernameOrEmail, page, limit);
  }
}
