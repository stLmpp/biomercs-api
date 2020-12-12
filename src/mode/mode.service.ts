import { Injectable } from '@nestjs/common';
import { ModeRepository } from './mode.repository';
import { Mode } from './mode.entity';
import { ModeAddDto, ModeUpdateDto } from './mode.dto';

@Injectable()
export class ModeService {
  constructor(private modeRepository: ModeRepository) {}

  async findById(idMode: number): Promise<Mode> {
    return this.modeRepository.findOneOrFail(idMode);
  }

  async findAll(): Promise<Mode[]> {
    return this.modeRepository.find();
  }

  async add(dto: ModeAddDto): Promise<Mode> {
    return this.modeRepository.save(new Mode().extendDto(dto));
  }

  async update(idMode: number, dto: ModeUpdateDto): Promise<Mode> {
    await this.modeRepository.update(idMode, dto);
    return this.modeRepository.findOneOrFail(idMode);
  }
}
