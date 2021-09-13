import { promises as fs } from 'fs';
import { resolve as pathResolve } from 'path';
import { getArg, getSpinner, resolvePrettierrc } from './util';
import { format as prettierFormat } from 'prettier';
import { config } from 'dotenv';
import { Environment } from '../src/environment/environment';

const path = getArg<boolean>(['p', 'prod', 'production']) ? '/.env-prod' : '/.env';

config({ path: pathResolve(process.cwd() + path) });

const spinner = getSpinner();

async function writeOrmConfig(file: string): Promise<void> {
  spinner.start('Writing ormconfig.js');
  await fs.writeFile(pathResolve(process.cwd() + '/ormconfig.js'), file);
  spinner.stopAndPersist({ symbol: '✔', text: 'ormconfig.js created' });
}

export async function generateOrmConfig(): Promise<void> {
  const { autoLoadEntities, ...typeormConfig } = new Environment().getTypeOrmConfig();

  const dbOptions = JSON.stringify({
    ...typeormConfig,
    synchronize: false,
    namingStrategy: 'new NamingStrategy()',
    entities: [pathResolve(process.cwd() + '/dist/**/*.entity.js'), pathResolve(process.cwd() + '/dist/**/*.view.js')],
  }).replace(`"new NamingStrategy()"`, 'new NamingStrategy()');

  let file = `const { NamingStrategy } = require('./dist/src/environment/naming.strategy'); module.exports = ${dbOptions};`;

  const prettierrc = await resolvePrettierrc();
  file = prettierFormat(file, prettierrc);

  await writeOrmConfig(file);
}
