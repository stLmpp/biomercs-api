import { generateOrmConfig } from './ormconfig';
import { buildBackEnd, setDefaultVariables } from './util';

(async () => {
  setDefaultVariables();
  await buildBackEnd();
  await generateOrmConfig();
})();
