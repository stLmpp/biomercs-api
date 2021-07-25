import { Injectable } from '@nestjs/common';
import { RuleRepository } from './rule.repository';
import { RuleAddDto, RuleUpdateDto, RuleUpsertDto } from './rule.dto';
import { Rule } from './rule.entity';
import { arrayRemoveMutate } from 'st-utils';

@Injectable()
export class RuleService {
  constructor(private ruleRepository: RuleRepository) {}

  async add(dto: RuleAddDto): Promise<Rule> {
    return this.ruleRepository.save(new Rule().extendDto(dto));
  }

  async update(idRule: string, dto: RuleUpdateDto): Promise<Rule> {
    const rule = { ...(await this.ruleRepository.findOneOrFail(idRule)), ...dto };
    await this.ruleRepository.update(idRule, dto);
    return new Rule().extendDto(rule);
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
}
