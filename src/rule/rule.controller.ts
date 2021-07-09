import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../auth/api-auth.decorator';
import { RuleService } from './rule.service';
import { RuleViewModel } from './rule.view-model';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { RuleAddDto, RuleUpdateDto, RuleUpsertDto } from './rule.dto';
import { Params } from '../shared/type/params';
import { RuleUpsertRemoveInvalidPipe } from './rule-upsert-remove-invalid.pipe';
import { InjectMapProfile } from '../mapper/inject-map-profile';
import { Rule } from './rule.entity';
import { MapProfile } from '../mapper/map-profile';

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
    return this.mapProfile.mapPromise(this.ruleService.add(dto));
  }

  @ApiAdmin()
  @ApiAuth()
  @Patch(`:${Params.idRule}`)
  async update(@Param(Params.idRule) idRule: string, @Body() dto: RuleUpdateDto): Promise<RuleViewModel> {
    return this.mapProfile.mapPromise(this.ruleService.update(idRule, dto));
  }

  @ApiAdmin()
  @ApiAuth()
  @ApiBody({ isArray: true, type: RuleUpsertDto, required: true, description: 'Make sure to send all fields' })
  @Post('upsert')
  async upsert(@Body(RuleUpsertRemoveInvalidPipe) dtos: RuleUpsertDto[]): Promise<RuleViewModel[]> {
    return this.mapProfile.mapPromise(this.ruleService.upsert(dtos));
  }

  @Get()
  async findAll(): Promise<RuleViewModel[]> {
    return this.mapProfile.mapPromise(this.ruleService.findAll());
  }
}
