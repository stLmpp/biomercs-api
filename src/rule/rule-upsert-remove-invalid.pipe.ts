import { Injectable, PipeTransform } from '@nestjs/common';
import { RuleUpsertDto } from './rule.dto';

@Injectable()
export class RuleUpsertRemoveInvalidPipe implements PipeTransform {
  transform(dtos: RuleUpsertDto[]): RuleUpsertDto[] {
    return dtos.filter(dto => !dto.deleted || dto.id);
  }
}
