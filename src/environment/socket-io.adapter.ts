import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';
import { Environment } from './environment';
import { Server, ServerOptions } from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
  constructor(app: INestApplication, private environment: Environment) {
    super(app);
  }

  // TODO check this error

  // @ts-ignore
  override create(port: number, options?: ServerOptions & { namespace?: string; server?: any }): Server {
    if (options) {
      options = {
        ...options,
        path: this.environment.get('WEBSOCKET_PATH'),
        transports: this.environment.get('WEBSOCKET_TRANSPORTS'),
      };
    }
    // @ts-ignore
    return super.create(port, options);
  }
}
