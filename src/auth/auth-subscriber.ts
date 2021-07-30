import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { getRequestContext } from '../async-hooks';
import { AUTH_USER_CONTEXT_TOKEN } from './auth-user-context-token';
import { User } from '../user/user.entity';
import { BaseEntity } from '../shared/super/base-entity';

export function eventEntityHasColumns<T extends UpdateEvent<any> | InsertEvent<any>, K extends keyof BaseEntity>(
  event: T,
  columns: K[]
): event is T & { entity: { [KEY in K]: BaseEntity[KEY] } } {
  return !!event.entity && columns.every(column => event.metadata.findColumnWithPropertyName(column));
}

@EventSubscriber()
export class AuthSubscriber implements EntitySubscriberInterface {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  beforeUpdate(event: UpdateEvent<any>): Promise<any> | void {
    if (eventEntityHasColumns(event, ['lastUpdatedBy'])) {
      event.entity.lastUpdatedBy = getRequestContext<User>(AUTH_USER_CONTEXT_TOKEN)?.id ?? -1;
    }
  }

  beforeInsert(event: InsertEvent<any>): Promise<any> | void {
    if (eventEntityHasColumns(event, ['lastUpdatedBy', 'createdBy'])) {
      const idUser = getRequestContext<User>(AUTH_USER_CONTEXT_TOKEN)?.id ?? -1;
      event.entity.createdBy = idUser;
      event.entity.lastUpdatedBy = idUser;
    }
  }
}
