import { Module } from '@nestjs/common';
import { EncryptorService } from './encryptor.service';
import { ENCRYPTOR_SECRET_TOKEN } from './encryptor.token';
import { EnvironmentModule } from '../environment/environment.module';
import { Environment } from '../environment/environment';

@Module({
  imports: [EnvironmentModule],
  providers: [
    {
      provide: ENCRYPTOR_SECRET_TOKEN,
      inject: [Environment],
      useFactory: (environment: Environment) => environment.get('JWT_SECRET'),
    },
    EncryptorService,
  ],
  exports: [EncryptorService],
})
export class EncryptorModule {}
