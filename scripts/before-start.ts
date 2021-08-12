import { createConnection } from 'typeorm';
import { asyncSpawn, getSpinner } from './util';

const spinner = getSpinner();

async function main(): Promise<void> {
  spinner.start('Installing dependencies');
  await asyncSpawn('yarn');
  spinner.stopAndPersist({ symbol: '✔', text: 'Dependencies installed' });
  spinner.start('Creating ormconfig');
  await asyncSpawn('yarn create-orm-config');
  spinner.stopAndPersist({ symbol: '✔', text: 'ormconfig created' });
  spinner.start('Connecting to the database');
  const connection = await createConnection();
  spinner.stopAndPersist({ symbol: '✔', text: 'Connected' });
  spinner.start('Checking for pending migrations');
  if (await connection.showMigrations()) {
    spinner.stopAndPersist({ symbol: '✔', text: 'Pending migrations found' });
    spinner.start('Running migrations');
    await connection.runMigrations();
    spinner.stopAndPersist({ symbol: '✔', text: 'Migrations completed' });
  } else {
    spinner.stopAndPersist({ symbol: '✔', text: 'No pending migrations found' });
  }
  spinner.start('Closing the connection');
  await connection.close();
  spinner.stopAndPersist({ symbol: '✔', text: 'Connection closed, you can start developing now :)' });
}

main().then().catch(console.error);
