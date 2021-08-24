import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../auth/api-auth.decorator';
import { ApiAdmin } from '../../auth/api-admin.decorator';
import { SubCategoryViewModel } from './sub-category.view-model';
import { SubCategoryAddDto, SubCategoryUpdateDto } from './sub-category.dto';
import { SubCategoryService } from './sub-category.service';
import { Params } from '../../shared/type/params';

@ApiAuth()
@ApiTags('Sub category')
@Controller()
export class SubCategoryController {
  constructor(private subCategoryService: SubCategoryService) {}

  @ApiAdmin()
  @Post()
  async add(@Body() dto: SubCategoryAddDto): Promise<SubCategoryViewModel> {
    return this.subCategoryService.add(dto);
  }

  @ApiAdmin()
  @Patch(`:${Params.idSubCategory}`)
  async update(
    @Param(Params.idSubCategory) idSubCategory: number,
    @Body() dto: SubCategoryUpdateDto
  ): Promise<SubCategoryViewModel> {
    return this.subCategoryService.update(idSubCategory, dto);
  }

  @ApiAdmin()
  @ApiBody({ type: Number, isArray: true })
  @Put('order')
  async updateOrder(@Body() idSubCategories: number[]): Promise<SubCategoryViewModel[]> {
    return this.subCategoryService.updateOrder(idSubCategories);
  }

  @Get(`:${Params.idSubCategory}`)
  async findById(@Param(Params.idSubCategory) idSubCategory: number): Promise<SubCategoryViewModel> {
    return this.subCategoryService.findById(idSubCategory);
  }
}
