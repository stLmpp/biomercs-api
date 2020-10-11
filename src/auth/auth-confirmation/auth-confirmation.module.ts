import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthConfirmationRepository } from './auth-confirmation.repository';
import { AuthConfirmationService } from './auth-confirmation.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuthConfirmationRepository])],
  providers: [AuthConfirmationService],
  exports: [AuthConfirmationService],
})
export class AuthConfirmationModule {}
