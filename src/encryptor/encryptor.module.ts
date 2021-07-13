import { Module } from '@nestjs/common';
import { EncryptorService } from './encryptor.service';
import { ENCRYPTOR_SECRET_TOKEN } from './encryptor.token';
import { environment } from '../environment/environment';

@Module({
  providers: [
    {
      provide: ENCRYPTOR_SECRET_TOKEN,
      useValue: environment.get('JWT_SECRET'),
    },
    EncryptorService,
  ],
  exports: [EncryptorService],
})
export class EncryptorModule {}
