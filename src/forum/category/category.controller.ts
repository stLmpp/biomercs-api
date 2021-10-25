import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../auth/api-auth.decorator';
import { ApiAdmin } from '../../auth/api-admin.decorator';
import {
  CategoriesWithRecentTopicsViewModel,
  CategoryViewModel,
  CategoryWithSubCategoriesAltViewModel,
  CategoryWithSubCategoriesViewModel,
} from './category.view-model';
import { CategoryAddDto, CategoryUpdateDto } from './category.dto';
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
    private mapProfileWithSubCategories: MapProfile<Category, CategoryWithSubCategoriesViewModel>,
    @InjectMapProfile(Category, CategoryViewModel) private mapProfile: MapProfile<Category, CategoryViewModel>,
    @InjectMapProfile(Category, CategoryWithSubCategoriesAltViewModel)
    private mapProfileWithSubCategoriesAlt: MapProfile<Category, CategoryWithSubCategoriesAltViewModel>
  ) {}

  @ApiAdmin()
  @Post()
  async add(@Body() dto: CategoryAddDto): Promise<CategoryViewModel> {
    return this.mapProfileWithSubCategories.map(await this.categoryService.add(dto));
  }

  @ApiAdmin()
  @Patch(`:${Params.idCategory}`)
  async update(
    @Param(Params.idCategory) idCategory: number,
    @Body() dto: CategoryUpdateDto,
    @AuthUser(AuthPlayerPipe) player: Player
  ): Promise<CategoryViewModel> {
    return this.mapProfile.map(await this.categoryService.update(idCategory, dto, player.id));
  }

  @ApiAdmin()
  @ApiBody({ type: Number, isArray: true })
  @Put('order')
  async updateOrder(@Body() idCategories: number[]): Promise<CategoryViewModel[]> {
    return this.mapProfile.map(await this.categoryService.updateOrder(idCategories));
  }

  @Get()
  async findAll(): Promise<CategoryWithSubCategoriesAltViewModel[]> {
    return this.mapProfileWithSubCategoriesAlt.map(await this.categoryService.findAll());
  }

  @Get('with/recent-topics')
  async findAllWithRecentTopics(
    @AuthUser(AuthPlayerPipe) player: Player
  ): Promise<CategoriesWithRecentTopicsViewModel> {
    return this.categoryService.findAllWithRecentTopics(player.id);
  }

  @Get(`:${Params.idCategory}`)
  async findById(
    @Param(Params.idCategory) idCategory: number,
    @AuthUser(AuthPlayerPipe) player: Player
  ): Promise<CategoryViewModel> {
    return this.mapProfile.map(await this.categoryService.findById(idCategory, player.id));
  }
}
