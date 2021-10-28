import { Module } from '@nestjs/common';
import { PlatformInputTypeService } from './platform-input-type.service';
import { PlatformInputTypeController } from './platform-input-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformInputTypeRepository } from './platform-input-type.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformInputTypeRepository])],
  providers: [PlatformInputTypeService],
  controllers: [PlatformInputTypeController],
  exports: [PlatformInputTypeService],
})
export class PlatformInputTypeModule {}
