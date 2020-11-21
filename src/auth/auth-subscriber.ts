import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { getRequestContext } from '../async-hooks';
import { AUTH_USER_CONTEXT_TOKEN } from './auth-user-context-token';
import { User } from '../user/user.entity';

@EventSubscriber()
export class AuthSubscriber implements EntitySubscriberInterface {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  beforeUpdate(event: UpdateEvent<any>): Promise<any> | void {
    event.entity.lastUpdatedBy = getRequestContext<User>(AUTH_USER_CONTEXT_TOKEN)?.id ?? -1;
  }

  beforeInsert(event: InsertEvent<any>): Promise<any> | void {
    const idUser = getRequestContext<User>(AUTH_USER_CONTEXT_TOKEN)?.id ?? -1;
    event.entity.createdBy = idUser;
    event.entity.lastUpdatedBy = idUser;
  }
}
