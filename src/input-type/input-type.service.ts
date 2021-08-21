import { Injectable } from '@nestjs/common';
import { InputTypeRepository } from './input-type.repository';
import { InputType } from './input-type.entity';

@Injectable()
export class InputTypeService {
  constructor(private inputTypeRepository: InputTypeRepository) {}

  async findByPlatform(idPlatform: number): Promise<InputType[]> {
    return this.inputTypeRepository.findByPlatform(idPlatform);
  }
}
