import { Module } from '@nestjs/common';
import { PlatformInputTypeService } from './platform-input-type.service';
import { PlatformInputTypeController } from './platform-input-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformInputTypeRepository } from './platform-input-type.repository';
import { MapperModule } from '../../mapper/mapper.module';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformInputTypeRepository]), MapperModule],
  providers: [PlatformInputTypeService],
  controllers: [PlatformInputTypeController],
  exports: [PlatformInputTypeService],
})
export class PlatformInputTypeModule {}
