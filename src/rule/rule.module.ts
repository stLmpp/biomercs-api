import { Module } from '@nestjs/common';
import { RuleController } from './rule.controller';
import { RuleService } from './rule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RuleRepository } from './rule.repository';
import { MapperModule } from '../mapper/mapper.module';
import { MapperService } from '../mapper/mapper.service';
import { Rule } from './rule.entity';
import { RuleViewModel } from './rule.view-model';

@Module({
  imports: [TypeOrmModule.forFeature([RuleRepository]), MapperModule],
  controllers: [RuleController],
  providers: [RuleService],
})
export class RuleModule {
  constructor(private mapperService: MapperService) {
    this.mapperService.create(Rule, RuleViewModel);
  }
}
