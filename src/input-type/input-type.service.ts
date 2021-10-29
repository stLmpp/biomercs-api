import { Injectable } from '@nestjs/common';
import { InputTypeRepository } from './input-type.repository';
import { InputType } from './input-type.entity';

@Injectable()
export class InputTypeService {
  constructor(private inputTypeRepository: InputTypeRepository) {}

  async findAll(): Promise<InputType[]> {
    return this.inputTypeRepository.find();
  }

  async findById(idInputType: number): Promise<InputType> {
    return this.inputTypeRepository.findOneOrFail(idInputType);
  }
}
