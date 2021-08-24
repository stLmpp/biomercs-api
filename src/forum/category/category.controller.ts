import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../auth/api-auth.decorator';
import { ApiAdmin } from '../../auth/api-admin.decorator';
import { CategoryViewModel, CategoryWithSubCategoriesViewModel } from './category.view-model';
import { CategoryAddDto, CategoryUpsertDto } from './category.dto';
import { CategoryService } from './category.service';
import { AuthPlayerPipe } from '../../auth/auth-player.decorator';
import { Player } from '../../player/player.entity';
import { AuthUser } from '../../auth/auth-user.decorator';
import { InjectMapProfile } from '../../mapper/inject-map-profile';
import { Category } from './category.entity';
import { MapProfile } from '../../mapper/map-profile';
import { Params } from '../../shared/type/params';

@ApiAuth()
@ApiTags('Category')
@Controller()
export class CategoryController {
  constructor(
    private categoryService: CategoryService,
    @InjectMapProfile(Category, CategoryWithSubCategoriesViewModel)
    private mapProfile: MapProfile<Category, CategoryWithSubCategoriesViewModel>
  ) {}

  @ApiAdmin()
  @Post()
  async add(@Body() dto: CategoryAddDto): Promise<CategoryViewModel> {
    return this.mapProfile.mapPromise(this.categoryService.add(dto));
  }

  @ApiAdmin()
  @ApiBody({ type: CategoryUpsertDto, isArray: true })
  @Post('upsert')
  async upsert(
    @Body() dtos: CategoryUpsertDto[],
    @AuthUser(AuthPlayerPipe) player: Player
  ): Promise<CategoryWithSubCategoriesViewModel[]> {
    return this.categoryService.upsert(dtos, player.id);
  }

  @Get()
  async findAll(@AuthUser(AuthPlayerPipe) player: Player): Promise<CategoryWithSubCategoriesViewModel[]> {
    return this.categoryService.findAll(player.id);
  }

  @Get(`:${Params.idCategory}`)
  async findById(
    @Param(Params.idCategory) idCategory: number,
    @AuthUser(AuthPlayerPipe) player: Player
  ): Promise<CategoryViewModel> {
    return this.mapProfile.mapPromise(this.categoryService.findById(idCategory, player.id));
  }
}
