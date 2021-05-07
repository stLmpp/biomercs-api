import { config } from 'dotenv';
import { promises as fs } from 'fs';
import { resolve as pathResolve } from 'path';
import { format as prettierFormat, Options, resolveConfig } from 'prettier';
import { exec as cpExec } from 'child_process';
import * as ora from 'ora';
import { promisify } from 'util';
import { coerceArray } from 'st-utils';
import * as yargs from 'yargs';

const exec = promisify(cpExec);

config();

const spinner = ora({ spinner: 'dots' });

const args = yargs.parse(process.argv.slice(2));

function getArg<T>(argNames: string | string[]): T | undefined {
  for (const argName of coerceArray(argNames)) {
    if (argName in args) {
      return args[argName] as T;
    }
  }
  return undefined;
}

const migrationName = getArg<string>(['n', 'name']);

if (!migrationName) {
  throw new Error('Name of the migration is required');
}

async function build(): Promise<void> {
  spinner.start('Building project');
  await exec('yarn build');
  spinner.stopAndPersist({ symbol: '✔', text: 'Build completed' });
}

async function resolvePrettierrc(): Promise<Options> {
  spinner.start('Getting prettierrc');
  const prettierrc = await resolveConfig(process.cwd());
  spinner.stopAndPersist({ symbol: '✔', text: 'Prettier config resolved' });
  return { ...prettierrc, parser: 'babel' };
}

async function writeOrmConfig(file: string): Promise<void> {
  spinner.start('Writing ormconfig.js');
  await fs.writeFile(pathResolve(process.cwd() + '/ormconfig.js'), file);
  spinner.stopAndPersist({ symbol: '✔', text: 'ormconfig.js created' });
}

async function generateMigration(): Promise<void> {
  spinner.start('Generating migration');
  await exec('yarn generate-migration -o -n ' + migrationName);
  spinner.stopAndPersist({ symbol: '✔', text: 'Migration generated' });
}

(async () => {
  const skipBuild = getArg<boolean>('skip-build');
  if (!skipBuild) {
    await build();
  }

  const { DB_TYPEORM_CONFIG } = await import('./src/environment/db.config');

  const dbOptions = JSON.stringify({
    ...DB_TYPEORM_CONFIG,
    synchronize: false,
    namingStrategy: 'new NamingStategy()',
    entities: [pathResolve(process.cwd() + '/dist/**/*.entity.js')],
  }).replace(`"new NamingStategy()"`, 'new NamingStategy()');

  let file = `const { NamingStategy } = require('./dist/src/environment/naming.strategy');\n\nmodule.exports = ${dbOptions};`;

  const prettierrc = await resolvePrettierrc();
  file = prettierFormat(file, prettierrc);

  await writeOrmConfig(file);
  await generateMigration();
})();
