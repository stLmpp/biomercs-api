import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../auth/api-auth.decorator';
import { SubCategoryModeratorService } from './sub-category-moderator.service';
import { InjectMapProfile } from '../../mapper/inject-map-profile';
import { SubCategoryModerator } from './sub-category-moderator.entity';
import { SubCategoryModeratorViewModel } from './sub-category-moderator.view-model';
import { MapProfile } from '../../mapper/map-profile';
import { Params } from '../../shared/type/params';
import { ApiAdmin } from '../../auth/api-admin.decorator';
import { SubCategoryModeratorAddAndDeleteDto } from './sub-category-moderator.dto';
import { ModeratorViewModel } from '../moderator/moderator.view-model';

@ApiAuth()
@ApiTags('Sub Category Moderator')
@Controller()
export class SubCategoryModeratorController {
  constructor(
    private subCategoryModeratorService: SubCategoryModeratorService,
    @InjectMapProfile(SubCategoryModerator, SubCategoryModeratorViewModel)
    private mapProfile: MapProfile<SubCategoryModerator, SubCategoryModeratorViewModel>
  ) {}

  @ApiAdmin()
  @Put(`sub-category/:${Params.idSubCategory}/add-and-delete`)
  async addAndDeleteModerators(
    @Param(Params.idSubCategory) idSubCategory: number,
    @Body() dto: SubCategoryModeratorAddAndDeleteDto
  ): Promise<ModeratorViewModel[]> {
    return this.mapProfile.map(await this.subCategoryModeratorService.addAndDelete(idSubCategory, dto));
  }

  @Get(`sub-category/:${Params.idSubCategory}`)
  async findBySubCategory(
    @Param(Params.idSubCategory) idSubCategory: number
  ): Promise<SubCategoryModeratorViewModel[]> {
    return this.mapProfile.map(await this.subCategoryModeratorService.findBySubCategory(idSubCategory));
  }
}
