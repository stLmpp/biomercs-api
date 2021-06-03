import { Injectable } from '@nestjs/common';
import { RuleRepository } from './rule.repository';
import { RuleViewModel } from './rule.view-model';
import { RuleAddDto, RuleUpdateDto, RuleUpsertDto } from './rule.dto';
import { Rule } from './rule.entity';
import { MapperService } from '../mapper/mapper.service';
import { arrayRemoveMutate } from 'st-utils';

@Injectable()
export class RuleService {
  constructor(private ruleRepository: RuleRepository, private mapperService: MapperService) {}

  async add(dto: RuleAddDto): Promise<RuleViewModel> {
    const rule = await this.ruleRepository.save(new Rule().extendDto(dto));
    return this.mapperService.map(Rule, RuleViewModel, rule);
  }

  async update(idRule: string, dto: RuleUpdateDto): Promise<RuleViewModel> {
    const rule = { ...(await this.ruleRepository.findOneOrFail(idRule)), ...dto };
    await this.ruleRepository.update(idRule, dto);
    return this.mapperService.map(Rule, RuleViewModel, rule);
  }

  async upsert(dtos: RuleUpsertDto[]): Promise<RuleViewModel[]> {
    /** This non-null assertion is safe because this dto is filtered in the {@see RuleUpsertRemoveInvalidPipe} */
    await Promise.all(arrayRemoveMutate(dtos, dto => dto.deleted).map(dto => this.ruleRepository.delete(dto.id!)));
    const rules = await this.ruleRepository.save(dtos);
    return this.mapperService.map(Rule, RuleViewModel, rules);
  }

  async delete(id: string): Promise<void> {
    await this.ruleRepository.delete(id);
  }

  async findAll(): Promise<RuleViewModel[]> {
    const rules = await this.ruleRepository.find();
    return this.mapperService.map(Rule, RuleViewModel, rules);
  }
}
