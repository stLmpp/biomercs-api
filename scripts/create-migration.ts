import { config } from 'dotenv';
import { resolve as pathResolve } from 'path';
import { asyncSpawn, buildBackEnd, getArg, getSpinner } from './util';
import { generateOrmConfig } from './ormconfig';

const spinner = getSpinner();

const path = getArg<boolean>(['p', 'prod', 'production']) ? '/.env-prod' : '/.env';

config({ path: pathResolve(process.cwd() + path) });

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
