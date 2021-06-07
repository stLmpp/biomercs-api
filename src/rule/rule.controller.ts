import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../auth/api-auth.decorator';
import { RuleService } from './rule.service';
import { RuleViewModel } from './rule.view-model';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { RuleAddDto, RuleUpdateDto, RuleUpsertDto } from './rule.dto';
import { Params } from '../shared/type/params';
import { RuleUpsertRemoveInvalidPipe } from './rule-upsert-remove-invalid.pipe';

@ApiTags('Rule')
@Controller('rule')
export class RuleController {
  constructor(private ruleService: RuleService) {}

  @ApiAuth()
  @ApiAdmin()
  @Post()
  async add(@Body() dto: RuleAddDto): Promise<RuleViewModel> {
    return this.ruleService.add(dto);
  }

  @ApiAuth()
  @ApiAdmin()
  @Patch(`:${Params.idRule}`)
  async update(@Param(Params.idRule) idRule: string, @Body() dto: RuleUpdateDto): Promise<RuleViewModel> {
    return this.ruleService.update(idRule, dto);
  }

  @ApiAuth()
  @ApiAdmin()
  @ApiBody({ isArray: true, type: RuleUpsertDto, required: true, description: 'Make sure to send all fields' })
  @Post('upsert')
  async upsert(@Body(RuleUpsertRemoveInvalidPipe) dtos: RuleUpsertDto[]): Promise<RuleViewModel[]> {
    return this.ruleService.upsert(dtos);
  }

  @Get()
  async findAll(): Promise<RuleViewModel[]> {
    return this.ruleService.findAll();
  }
}
