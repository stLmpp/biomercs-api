import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../auth/api-auth.decorator';
import { ApiAdmin } from '../../auth/api-admin.decorator';
import { SubCategoryViewModel, SubCategoryWithInfoModeratorsTopicsViewModel } from './sub-category.view-model';
import { SubCategoryAddDto, SubCategoryOrderDto, SubCategoryUpdateDto } from './sub-category.dto';
import { SubCategoryService } from './sub-category.service';
import { Params } from '../../shared/type/params';
import { InjectMapProfile } from '../../mapper/inject-map-profile';
import { SubCategory } from './sub-category.entity';
import { MapProfile } from '../../mapper/map-profile';
import { AuthUser } from '../../auth/auth-user.decorator';
import { AuthPlayerPipe } from '../../auth/auth-player.decorator';
import { Player } from '../../player/player.entity';

@ApiAuth()
@ApiTags('Sub category')
@Controller()
export class SubCategoryController {
  constructor(
    private subCategoryService: SubCategoryService,
    @InjectMapProfile(SubCategory, SubCategoryViewModel)
    private mapProfile: MapProfile<SubCategory, SubCategoryViewModel>
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
  @ApiBody({ type: SubCategoryOrderDto, isArray: true })
  @Put('order')
  async updateOrder(@Body() dtos: SubCategoryOrderDto[]): Promise<SubCategoryViewModel[]> {
    return this.mapProfile.map(await this.subCategoryService.updateOrder(dtos));
  }

  @Get(`:${Params.idSubCategory}`)
  async findById(@Param(Params.idSubCategory) idSubCategory: number): Promise<SubCategoryViewModel> {
    return this.mapProfile.map(await this.subCategoryService.findById(idSubCategory));
  }

  @Get(`:${Params.idSubCategory}/with/info/moderators/topics`)
  async findByIdWithTopics(
    @AuthUser(AuthPlayerPipe) player: Player,
    @Param(Params.idSubCategory) idSubCategory: number,
    @Query(Params.page) page: number,
    @Query(Params.limit) limit: number
  ): Promise<SubCategoryWithInfoModeratorsTopicsViewModel> {
    return this.subCategoryService.findByIdWithTopicsPaginated(idSubCategory, player.id, page, limit);
  }
}
