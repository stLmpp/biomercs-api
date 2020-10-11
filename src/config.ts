import { environment } from './environment/environment';
import { config } from 'dotenv';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';

if (!environment.production) {
  config();
}

initializeTransactionalContext();
patchTypeORMRepositoryWithBaseRepository();
