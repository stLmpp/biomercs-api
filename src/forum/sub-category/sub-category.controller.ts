import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../auth/api-auth.decorator';
import { ApiAdmin } from '../../auth/api-admin.decorator';
import { SubCategoryViewModel } from './sub-category.view-model';
import { SubCategoryAddDto, SubCategoryUpdateDto } from './sub-category.dto';
import { SubCategoryService } from './sub-category.service';
import { Params } from '../../shared/type/params';
import { InjectMapProfile } from '../../mapper/inject-map-profile';
import { SubCategory } from './sub-category.entity';
import { MapProfile } from '../../mapper/map-profile';
import { Moderator } from '../moderator/moderator.entity';
import { ModeratorViewModel } from '../moderator/moderator.view-model';
import { SubCategoryModeratorService } from '../sub-category-moderator/sub-category-moderator.service';
import { SubCategoryModeratorAddAndDeleteDto } from '../sub-category-moderator/sub-category-moderator.dto';
import { ModeratorService } from '../moderator/moderator.service';

@ApiAuth()
@ApiTags('Sub category')
@Controller()
export class SubCategoryController {
  constructor(
    private subCategoryService: SubCategoryService,
    @InjectMapProfile(SubCategory, SubCategoryViewModel)
    private mapProfile: MapProfile<SubCategory, SubCategoryViewModel>,
    private subCategoryModeratorService: SubCategoryModeratorService,
    @InjectMapProfile(Moderator, ModeratorViewModel)
    private mapProfileModerator: MapProfile<Moderator, ModeratorViewModel>,
    private moderatorService: ModeratorService
  ) {}

  @ApiAdmin()
  @Post()
  async add(@Body() dto: SubCategoryAddDto): Promise<SubCategoryViewModel> {
    return this.mapProfile.map(await this.subCategoryService.add(dto));
  }

  @ApiAdmin()
  @Patch(`:${Params.idSubCategory}`)
  async update(
    @Param(Params.idSubCategory) idSubCategory: number,
    @Body() dto: SubCategoryUpdateDto
  ): Promise<SubCategoryViewModel> {
    return this.mapProfile.map(await this.subCategoryService.update(idSubCategory, dto));
  }

  @ApiAdmin()
  @ApiBody({ type: Number, isArray: true })
  @Put('order')
  async updateOrder(@Body() idSubCategories: number[]): Promise<SubCategoryViewModel[]> {
    return this.mapProfile.map(await this.subCategoryService.updateOrder(idSubCategories));
  }

  @ApiAdmin()
  @Put(`:${Params.idSubCategory}/moderators/add-and-delete`)
  async addAndDeleteModerators(
    @Param(Params.idSubCategory) idSubCategory: number,
    @Body() dto: SubCategoryModeratorAddAndDeleteDto
  ): Promise<ModeratorViewModel[]> {
    return this.mapProfileModerator.map(await this.subCategoryModeratorService.addAndDelete(idSubCategory, dto));
  }

  @Get(`:${Params.idSubCategory}`)
  async findById(@Param(Params.idSubCategory) idSubCategory: number): Promise<SubCategoryViewModel> {
    return this.mapProfile.map(await this.subCategoryService.findById(idSubCategory));
  }

  @Get(`:${Params.idSubCategory}/moderators`)
  async findModerators(@Param(Params.idSubCategory) idSubCategory: number): Promise<ModeratorViewModel[]> {
    return this.mapProfileModerator.map(await this.moderatorService.findBySubCategory(idSubCategory));
  }
}
