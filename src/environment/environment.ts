import { get, has } from 'config';
import { snakeCase } from 'snake-case';
import { genSalt } from 'bcrypt';
import { resolve } from 'path';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { NamingStrategy } from './naming.strategy';
import { version } from '../../package.json';
import { JwtModuleOptions } from '@nestjs/jwt';

// TODO figure out a way to convert the values to number/boolean/array/etc
export interface EnvironmentInterface {
  JWT_EXPIRES_IN: number;
  JWT_SECRET: string;
  SECRET_CHAR: string;
  STEAM_API_KEY: string;
  USE_AUTH: boolean;
  USE_ERROR_FILTER: boolean;
  WEBSOCKET_PATH: string;
  WEBSOCKET_TRANSPORTS: Array<'polling' | 'websocket'>;
  MAIL_QUEUE_AUDIT_TIME: number;
  MAIL_QUEUE_MAX_RETRIES: number;
  MAIL_AWS_ACCESS_KEY_ID: string;
  MAIL_AWS_SECRET_ACCESS_KEY: string;
  MAIL_AWS_REGION: string;
  MAIL_AWS_API_VERSION: string;
  STEAM_OPENID_URL: string;
  FRONT_END_HOST: string;
  FRONT_END_PORT: number | undefined;
  HOST: string;
  PORT: number;
  MAIL_ADDRESS: string;
  MAIL_ADDRESS_OWNER: string;
  USERNAME_OWNER: string;
  DB_SYNCHRONIZE: boolean;
  DB_PASSWORD: string;
  DB_USERNAME: string;
  DB_DATABASE: string;
  DB_PORT: number;
  DB_HOST: string;
  NODE_ENV: string;
}

// TODO added cache of values, will be slightly faster than get the env from config
@Injectable()
export class Environment {
  private _salt?: string;
  private readonly _prefix = 'BIO';

  readonly production = this.get('NODE_ENV') === 'production';
  readonly http = 'http' + (this.production ? 's' : '');
  readonly apiUrl = this._getUrl(this.get('HOST'), this.get('PORT')) + '/api';
  readonly frontEndUrl = this._getUrl(this.get('FRONT_END_HOST'), this.get('FRONT_END_PORT'));
  readonly appVersion = version;

  private _getUrl(host: string, port?: number): string {
    let url = `${this.http}://${host}`;
    if (this.production && port) {
      url += `:${port}`;
    }
    return url;
  }

  private _normalizeKey(key: keyof EnvironmentInterface): string {
    if (key === 'NODE_ENV') {
      return key;
    }
    return snakeCase(`${this._prefix}_${key.toString()}`).toUpperCase();
  }

  private _getConfig(key: keyof EnvironmentInterface): any {
    const param = this._normalizeKey(key);
    if (has(param)) {
      return get(param);
    } else {
      return process.env[param];
    }
  }

  get<K extends keyof EnvironmentInterface>(key: K): EnvironmentInterface[K] {
    return this._getConfig(key);
  }

  async envSalt(): Promise<string> {
    if (!this._salt) {
      this._salt = await genSalt();
    }
    return this._salt;
  }

  getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      host: this.get('DB_HOST'),
      port: this.get('DB_PORT'),
      username: this.get('DB_USERNAME'),
      password: this.get('DB_PASSWORD'),
      database: this.get('DB_DATABASE'),
      synchronize: this.get('DB_SYNCHRONIZE'),
      type: 'postgres',
      autoLoadEntities: true,
      logging: !this.production ? 'all' : false,
      namingStrategy: new NamingStrategy(),
      dropSchema: false,
      migrations: [resolve(process.cwd() + '/migration/*.js')],
      cli: { migrationsDir: 'migration' },
    };
  }

  getJwtOptions(): JwtModuleOptions {
    return {
      secret: this.get('JWT_SECRET'),
      signOptions: {
        expiresIn: this.get('JWT_EXPIRES_IN'),
      },
    };
  }
}
