import ora from 'ora';
import { parse } from 'yargs';
import { coerceArray } from 'st-utils';
import { spawn, SpawnOptions } from 'child_process';
import { Options, resolveConfig } from 'prettier';

export function getSpinner(): ora.Ora {
  return ora({ spinner: 'dots' });
}

const rawArgs = parse(process.argv.slice(2));

export function getArg<T>(argNames: string | string[]): T | undefined {
  for (const argName of coerceArray(argNames)) {
    if (argName in rawArgs) {
      return (rawArgs as any)[argName] as T;
    }
  }
  return undefined;
}

export async function asyncSpawn(command: string, options?: SpawnOptions): Promise<void> {
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

export async function buildBackEnd(): Promise<void> {
  const spinner = getSpinner();
  spinner.start('Building project');
  await asyncSpawn('yarn build');
  spinner.stopAndPersist({ symbol: '✔', text: 'Build completed' });
}

export async function resolvePrettierrc(): Promise<Options> {
  const spinner = getSpinner();
  spinner.start('Getting prettierrc');
  const prettierrc = await resolveConfig(process.cwd());
  spinner.stopAndPersist({ symbol: '✔', text: 'Prettier config resolved' });
  return { ...prettierrc, parser: 'babel' };
}
