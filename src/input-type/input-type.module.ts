import { Module } from '@nestjs/common';
import { InputTypeController } from './input-type.controller';
import { InputTypeService } from './input-type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InputTypeRepository } from './input-type.repository';
import { MapperModule } from '../mapper/mapper.module';

@Module({
  imports: [TypeOrmModule.forFeature([InputTypeRepository]), MapperModule],
  controllers: [InputTypeController],
  providers: [InputTypeService],
  exports: [InputTypeService],
})
export class InputTypeModule {}
