import { Module } from '@nestjs/common';
import { InputTypeController } from './input-type.controller';
import { InputTypeService } from './input-type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InputTypeRepository } from './input-type.repository';

@Module({
  imports: [TypeOrmModule.forFeature([InputTypeRepository])],
  controllers: [InputTypeController],
  providers: [InputTypeService],
})
export class InputTypeModule {}
