import { Module } from '@nestjs/common';
import { RuleController } from './rule.controller';
import { RuleService } from './rule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RuleRepository } from './rule.repository';
import { MapperModule } from '../mapper/mapper.module';
import { EnvironmentModule } from '../environment/environment.module';

@Module({
  imports: [TypeOrmModule.forFeature([RuleRepository]), MapperModule, EnvironmentModule],
  controllers: [RuleController],
  providers: [RuleService],
})
export class RuleModule {}
