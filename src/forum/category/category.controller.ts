import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../auth/api-auth.decorator';
import { ApiAdmin } from '../../auth/api-admin.decorator';
import { CategoryViewModel } from './category.view-model';
import { CategoryUpsertDto } from './category.dto';
import { CategoryService } from './category.service';
import { AuthPlayerPipe } from '../../auth/auth-player.decorator';
import { Player } from '../../player/player.entity';
import { AuthUser } from '../../auth/auth-user.decorator';

@ApiAuth()
@ApiTags('Category')
@Controller()
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiAdmin()
  @ApiBody({ type: CategoryUpsertDto, isArray: true })
  @Post('upsert')
  async upsert(
    @Body() dtos: CategoryUpsertDto[],
    @AuthUser(AuthPlayerPipe) player: Player
  ): Promise<CategoryViewModel[]> {
    return this.categoryService.upsert(dtos, player.id);
  }

  @Get()
  async findAll(@AuthUser(AuthPlayerPipe) player: Player): Promise<CategoryViewModel[]> {
    return this.categoryService.findAll(player.id);
  }
}
