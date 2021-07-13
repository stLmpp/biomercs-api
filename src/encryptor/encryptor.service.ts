import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';
import { genSaltSync } from 'bcrypt';
import { Inject, Injectable } from '@nestjs/common';
import { ENCRYPTOR_SECRET_TOKEN } from './encryptor.token';

@Injectable()
export class EncryptorService {
  constructor(@Inject(ENCRYPTOR_SECRET_TOKEN) secret: string) {
    this._algorithm = 'aes-192-cbc';
    this._key = scryptSync(secret, genSaltSync(), 24);
  }

  private readonly _algorithm: string;
  private readonly _key: Buffer;

  encrypt(clearText: string): string {
    const iv = randomBytes(16);
    const cipher = createCipheriv(this._algorithm, this._key, iv);
    const encrypted = cipher.update(clearText, 'utf8', 'hex');
    return [encrypted + cipher.final('hex'), Buffer.from(iv).toString('hex')].join('$');
  }

  decrypt(encryptedText: string): string {
    const [encrypted, iv] = encryptedText.split('$');
    if (!iv) {
      return '';
    }
    const decipher = createDecipheriv(this._algorithm, this._key, Buffer.from(iv, 'hex'));
    return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
  }
}
