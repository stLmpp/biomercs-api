import { Module } from '@nestjs/common';
import { InputTypeController } from './input-type.controller';
import { InputTypeService } from './input-type.service';

@Module({
  controllers: [InputTypeController],
  providers: [InputTypeService],
})
export class InputTypeModule {}
