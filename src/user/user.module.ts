import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { MapperModule } from '../mapper/mapper.module';
import { MapperService } from '../mapper/mapper.service';
import { User } from './user.entity';
import { UserViewModel } from './user.view-model';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), MapperModule],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
  controllers: [UserController],
})
export class UserModule {
  constructor(private mapperService: MapperService) {
    this.mapperService.create(User, UserViewModel);
  }
}
