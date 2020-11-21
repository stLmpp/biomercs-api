import { createHook, executionAsyncId } from 'async_hooks';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

const store: Map<number, Map<string, any>> = new Map();

const asyncHook = createHook({
  init: (asyncId, _, triggerAsyncId) => {
    if (store.has(triggerAsyncId)) {
      store.set(asyncId, store.get(triggerAsyncId)!);
    }
  },
  destroy: asyncId => {
    if (store.has(asyncId)) {
      store.delete(asyncId);
    }
  },
});

asyncHook.enable();

export function getRequestContext<T = any>(name: string): T | undefined {
  return store.get(executionAsyncId())?.get(name);
}

export function registerRequestContext(
  name: string,
  dataCallback: (context: ExecutionContext) => any
): NestInterceptor {
  return new (class implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
      const data = dataCallback(context);
      const hasStore = store.get(executionAsyncId());
      if (hasStore) {
        hasStore.set(name, data);
      } else {
        store.set(executionAsyncId(), new Map().set(name, data));
      }
      return next.handle();
    }
  })();
}
