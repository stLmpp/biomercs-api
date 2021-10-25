import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../auth/api-auth.decorator';
import { RuleService } from './rule.service';
import { RuleViewModel } from './rule.view-model';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { RuleAddDto, RuleUpsertDto } from './rule.dto';
import { RuleUpsertRemoveInvalidPipe } from './rule-upsert-remove-invalid.pipe';
import { InjectMapProfile } from '../mapper/inject-map-profile';
import { Rule } from './rule.entity';
import { MapProfile } from '../mapper/map-profile';
import { Params } from '../shared/type/params';
import { RuleTypeEnum } from './rule-type.enum';

@ApiTags('Rule')
@Controller('rule')
export class RuleController {
  constructor(
    private ruleService: RuleService,
    @InjectMapProfile(Rule, RuleViewModel) private mapProfile: MapProfile<Rule, RuleViewModel>
  ) {}

  @ApiAdmin()
  @ApiAuth()
  @Post()
  async add(@Body() dto: RuleAddDto): Promise<RuleViewModel> {
    return this.mapProfile.map(await this.ruleService.add(dto));
  }

  @ApiAdmin()
  @ApiAuth()
  @ApiBody({ isArray: true, type: RuleUpsertDto, required: true, description: 'Make sure to send all fields' })
  @Post('upsert')
  async upsert(@Body(RuleUpsertRemoveInvalidPipe) dtos: RuleUpsertDto[]): Promise<RuleViewModel[]> {
    return this.mapProfile.map(await this.ruleService.upsert(dtos));
  }

  @Get()
  async findAll(): Promise<RuleViewModel[]> {
    return this.mapProfile.map(await this.ruleService.findAll());
  }

  @ApiParam({ name: Params.type, enum: RuleTypeEnum })
  @Get(`:${Params.type}`)
  async findByType(@Param(Params.type) type: RuleTypeEnum): Promise<RuleViewModel[]> {
    return this.mapProfile.map(await this.ruleService.findByType(type));
  }
}
