import { resolve } from 'path';
import * as ora from 'ora';
import { spawn, SpawnOptions } from 'child_process';
import { copy, rm, writeFile } from 'fs-extra';
import * as AdmZip from 'adm-zip';
import { environment } from './src/environment/environment';
import { coerceArray } from 'st-utils';
import * as yargs from 'yargs';

const spinner = ora({ spinner: 'dots' });

const pathFrontEnd = resolve(process.cwd() + '/../biomercs-ng');
const pathBackEndDist = resolve(process.cwd() + '/dist');

const rawArgs = yargs.parse(process.argv.slice(2));

function getArg<T>(argNames: string | string[]): T | undefined {
  for (const argName of coerceArray(argNames)) {
    if (argName in rawArgs) {
      return (rawArgs as any)[argName] as T;
    }
  }
  return undefined;
}

const args = {
  skipZip: getArg<boolean>(['skip-zip', 'sz']),
  skipBackEnd: getArg<boolean>(['skip-back-end', 'sbe']),
  skipInstall: getArg<boolean>(['skip-install', 'si']),
  dev: getArg<boolean>(['dev', 'd']),
};

async function asyncSpawn(command: string, options?: SpawnOptions): Promise<void> {
  const newOptions = { ...options, shell: true };
  return new Promise((resolvep, reject) => {
    try {
      const spawnCmd = spawn(command, newOptions);
      spawnCmd.stdout?.on('data', data => console.log(`\n${data}`));
      spawnCmd.stderr?.on('data', data => console.error(`\n${data}`));
      spawnCmd.on('close', () => {
        resolvep();
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function buildFrontEnd(): Promise<void> {
  spinner.start('Building front-end...');
  await asyncSpawn(`cd ${pathFrontEnd} && yarn build-prod`);
  spinner.stopAndPersist({ symbol: '✔', text: 'Front-end build completed' });
}

async function buildBackEnd(): Promise<void> {
  spinner.start('Building back-end...');
  await asyncSpawn('yarn build');
  spinner.stopAndPersist({ symbol: '✔', text: 'Back-end build completed' });
}

async function copyFrontEndDistToBackEndDist(): Promise<void> {
  spinner.start('Copying front-end to back-end dist...');
  await copy(resolve(pathFrontEnd + '/dist/biomercs-ng'), resolve(pathBackEndDist + '/frontend'));
  if (args.dev) {
    await rm(resolve(process.cwd() + '/frontend'), { force: true, recursive: true });
    await copy(resolve(pathFrontEnd + '/dist/biomercs-ng'), resolve(process.cwd() + '/frontend'));
  }
  spinner.stopAndPersist({ symbol: '✔', text: 'Copy front-end completed' });
}

async function copyConfigToDist(): Promise<void> {
  spinner.start('Copying config to dist');
  await copy(resolve(process.cwd() + '/config'), resolve(pathBackEndDist + '/config'));
  await copy(resolve(process.cwd() + '/mail'), resolve(pathBackEndDist + '/mail'));
  await copy(resolve(process.cwd() + '/Procfile'), resolve(pathBackEndDist + '/Procfile'));
  spinner.stopAndPersist({ symbol: '✔', text: 'Copy config completed' });
}

async function addEngineToPackageJson(): Promise<void> {
  spinner.start('Editing package.json');
  const packageJson = require('./package.json');
  packageJson.engines = { node: '14.16.1' };
  await writeFile(resolve(process.cwd() + '/dist/package.json'), JSON.stringify(packageJson));
  spinner.stopAndPersist({ symbol: '✔', text: 'Edited package.json' });
}

async function installDependencies(): Promise<void> {
  spinner.start('Installing dependencies');
  await asyncSpawn('cd dist && yarn install --production --ignore-engines');
  spinner.stopAndPersist({ symbol: '✔', text: 'Dependencies installed' });
}

async function zipFile(version: string): Promise<void> {
  spinner.start('Zipping');
  const zip = new AdmZip();
  zip.addLocalFolder(resolve(process.cwd() + '/dist/'));
  zip.writeZip(resolve(process.cwd() + '/dist/v' + version));
  spinner.stopAndPersist({ symbol: '✔', text: 'Zipped' });
}

async function main(): Promise<void> {
  await buildFrontEnd();
  if (!args.skipBackEnd) {
    await buildBackEnd();
  }
  await copyFrontEndDistToBackEndDist();
  await copyConfigToDist();
  await addEngineToPackageJson();
  if (!args.skipInstall) {
    await installDependencies();
  }
  if (!args.skipZip) {
    await zipFile(environment.appVersion);
  }
}

main().then();
