import { resolve } from 'path';
import { access, writeFile } from 'fs-extra';

const envOptions = [
  ['NODE_ENV', 'development'],
  ['MAIL_ADDRESS', 'mail_address'],
  ['JWT_SECRET', 'jwt_secret'],
  ['SECRET_CHAR', 'secret_char'],
  ['STEAM_API_KEY', 'steam_api_key'],
  ['DB_PASSWORD', 'password'],
  ['DB_USERNAME', 'username'],
  ['DB_DATABASE', 'biomercs'],
  ['DB_PORT', '5432'],
  ['DB_HOST', 'localhost'],
  ['MAIL_AWS_ACCESS_KEY_ID', 'MAIL_AWS_ACCESS_KEY_ID'],
  ['MAIL_AWS_SECRET_ACCESS_KEY', 'MAIL_AWS_SECRET_ACCESS_KEY'],
  ['MAIL_AWS_REGION', 'MAIL_AWS_REGION'],
  ['MAIL_AWS_API_VERSION', 'MAIL_AWS_API_VERSION'],
];

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
  const file = envOptions.map(([key, value]) => `${key}=${value}`).join('\n');
  await writeFile(resolve(process.cwd() + '/.env'), file);
})();
