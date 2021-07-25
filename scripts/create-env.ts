import 'reflect-metadata';
import { resolve } from 'path';
import { access, writeFile } from 'fs-extra';
import { getPropertiesMetadata } from '../src/mapper/property.decorator';
import { EnvironmentVariables, normalizeEnvironmentKey } from '../src/environment/environment';

async function envExists(): Promise<boolean> {
  try {
    await access(resolve(process.cwd() + '/.env'));
    return true;
  } catch {
    return false;
  }
}

(async () => {
  if (await envExists()) {
    console.log('.env already exists');
    return;
  }
  let envOptions: string[] = getPropertiesMetadata(EnvironmentVariables).map(({ propertyKey }) => propertyKey);
  const configDefault = await import('../config/default.json');
  const configDev = await import('../config/development.json');
  const excludeKeys = [...Object.keys(configDefault), ...Object.keys(configDev)];
  envOptions = envOptions.map(normalizeEnvironmentKey);
  const file = envOptions
    .filter(envKey => !excludeKeys.includes(envKey))
    .map(key => `${key}=${key}`)
    .join('\n');
  await writeFile(resolve(process.cwd() + '/.env'), file);
})();
