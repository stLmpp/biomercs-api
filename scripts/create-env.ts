import { resolve } from 'path';
import { access, writeFile } from 'fs-extra';

const envOptions = [
  ['NODE_ENV', 'development'],
  ['MAIL_ADDRESS', 'mail_address'],
  ['MAIL_PASSWORD', 'mail_password'],
  ['MAIL_SERVICE', 'gmail'],
  ['JWT_SECRET', 'jwt_secret'],
  ['SECRET_CHAR', 'secret_char'],
  ['STEAM_API_KEY', 'steam_api_key'],
  ['DB_PASSWORD', 'password'],
  ['DB_USERNAME', 'username'],
  ['DB_DATABASE', 'biomercs'],
  ['DB_PORT', '5432'],
  ['DB_HOST', 'localhost'],
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
