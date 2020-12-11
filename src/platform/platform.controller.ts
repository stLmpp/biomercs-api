import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlatformService } from './platform.service';
import { Platform } from './platform.entity';
import { PlatformAddDto, PlatformUpdateDto } from './platform.dto';
import { Params } from '../shared/type/params';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { ApiAuth } from '../auth/api-auth.decorator';

@ApiAuth()
@ApiTags('Platform')
@Controller('platform')
export class PlatformController {
  constructor(private platformService: PlatformService) {}

  @ApiAdmin()
  @Post()
  async add(@Body() dto: PlatformAddDto): Promise<Platform> {
    return this.platformService.add(dto);
  }

  @ApiAdmin()
  @Patch(`:${Params.idPlatform}`)
  async update(@Param(Params.idPlatform) idPlatform: number, @Body() dto: PlatformUpdateDto): Promise<Platform> {
    return this.platformService.update(idPlatform, dto);
  }

  @Get()
  async findAll(): Promise<Platform[]> {
    return this.platformService.findAll();
  }

  @Get(`:${Params.idPlatform}`)
  async findById(@Param(Params.idPlatform) idPlatform: number): Promise<Platform> {
    return this.platformService.findById(idPlatform);
  }
}
