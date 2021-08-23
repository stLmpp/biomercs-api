import { Injectable } from '@nestjs/common';
import { RuleRepository } from './rule.repository';
import { RuleAddDto, RuleUpsertDto } from './rule.dto';
import { Rule } from './rule.entity';
import { arrayRemoveMutate } from 'st-utils';
import { RuleTypeEnum } from './rule-type.enum';

@Injectable()
export class RuleService {
  constructor(private ruleRepository: RuleRepository) {}

  async add(dto: RuleAddDto): Promise<Rule> {
    return this.ruleRepository.save(new Rule().extendDto(dto));
  }

  async upsert(dtos: RuleUpsertDto[]): Promise<Rule[]> {
    /** This non-null assertion is safe because this dto is filtered in the {@see RuleUpsertRemoveInvalidPipe} */
    await Promise.all(arrayRemoveMutate(dtos, dto => dto.deleted).map(dto => this.ruleRepository.delete(dto.id!)));
    return await this.ruleRepository.save(dtos);
  }

  async delete(id: string): Promise<void> {
    await this.ruleRepository.delete(id);
  }

  async findAll(): Promise<Rule[]> {
    return await this.ruleRepository.find();
  }

  async findByType(type: RuleTypeEnum): Promise<Rule[]> {
    return this.ruleRepository.find({ where: { type } });
  }
}
