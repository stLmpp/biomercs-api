import { config } from 'dotenv';
// CONFIG needs to be here
config();
import { DB_TYPEORM_CONFIG } from './src/environment/db.config';
import { readFileSync, writeFileSync } from 'fs';
import { transpileModule } from 'typescript';
import { resolve } from 'path';
// TODO use typescript function to import the compiler options
import { compilerOptions } from './tsconfig.json';
import { format, resolveConfig } from 'prettier';

(async () => {
  // TODO find a better and more secure way to do this
  const namingStrategy = readFileSync(resolve(__dirname + '/src/environment/naming.strategy.ts')).toString();

  // TODO this replace export will generate some pain, try a better solution
  let file = transpileModule(namingStrategy.replace('export', ''), {
    compilerOptions: { ...(compilerOptions as any), sourceMap: false },
  }).outputText;

  file += `module.exports = ${JSON.stringify({
    ...DB_TYPEORM_CONFIG,
    synchronize: false,
    namingStrategy: 'new NamingStategy()',
    entities: [resolve(__dirname + '/dist/src/**/*.entity.js')],
  })};`.replace(`"new NamingStategy()"`, 'new NamingStategy()');

  const prettierrc = await resolveConfig(process.cwd());

  file = format(file, prettierrc ?? undefined);

  writeFileSync(__dirname + '/ormconfig.js', file, { encoding: 'utf-8' });

  // TODO run yarn build
  // TODO create script on package.json to generate migration
})();
