import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';

initializeTransactionalContext();
patchTypeORMRepositoryWithBaseRepository();
