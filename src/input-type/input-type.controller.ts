import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../auth/api-auth.decorator';
import { InputTypeService } from './input-type.service';
import { InputType } from './input-type.entity';
import { InputTypeViewModel } from './input-type.view-model';
import { InjectMapProfile } from '../mapper/inject-map-profile';
import { MapProfile } from '../mapper/map-profile';

@ApiAuth()
@ApiTags('Input type')
@Controller('input-type')
export class InputTypeController {
  constructor(
    private inputTypeService: InputTypeService,
    @InjectMapProfile(InputType, InputTypeViewModel) private mapProfile: MapProfile<InputType, InputTypeViewModel>
  ) {}

  @Get()
  async findAll(): Promise<InputTypeViewModel[]> {
    return this.mapProfile.map(await this.inputTypeService.findAll());
  }
}
