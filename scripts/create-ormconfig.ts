import { generateOrmConfig } from './ormconfig';
import { buildBackEnd } from './util';

(async () => {
  await buildBackEnd();
  await generateOrmConfig();
})();
