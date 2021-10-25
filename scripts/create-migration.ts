import { config } from 'dotenv';
import { resolve } from 'path';
import { asyncSpawn, buildBackEnd, getArg, getSpinner, setDefaultVariables } from './util';
import { generateOrmConfig } from './ormconfig';

const spinner = getSpinner();

setDefaultVariables();

const path = getArg<boolean>(['p', 'prod', 'production']) ? '/.env-prod' : '/.env';

config({ path: resolve(process.cwd() + path) });

const migrationName = getArg<string>(['n', 'name']);

if (!migrationName) {
  throw new Error('Name of the migration is required');
}

async function generateMigration(): Promise<void> {
  spinner.start('Generating migration');
  await asyncSpawn('yarn generate-migration -o -n ' + migrationName);
  spinner.stopAndPersist({ symbol: '✔', text: 'Migration generated' });
}

(async () => {
  const skipBuild = getArg<boolean>('skip-build');
  if (!skipBuild) {
    await buildBackEnd();
  }
  await generateOrmConfig();
  await generateMigration();
})();
