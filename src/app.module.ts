import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_TYPEORM_CONFIG } from './environment/db.config';
import { CoreModule } from './core/core.module';
import { ValidationModule } from './validation/validation.module';
import { HandleErrorFilter } from './environment/handle-error.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forRoot(DB_TYPEORM_CONFIG), CoreModule, ValidationModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HandleErrorFilter,
    },
  ],
})
export class AppModule {}
