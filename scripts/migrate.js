const path = require('path');
const { migrate } = require('postgres-migrations');
const db = require('../src/lib/db');

async function startMigration () {
  try {
    console.log('Starting migrations...');
    await migrate({ client: db }, path.resolve(__dirname, '../migrations/'));
    console.log('Finished doing migrations. All good!');
  } catch (e) {
    console.error('An error happened during the migration process:');
    console.error(e);
  } finally {
    await db.end();
  }
}

startMigration();
