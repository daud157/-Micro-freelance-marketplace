import { up } from '../migrations/20240319_update_application_schema.js';
import sequelize from '../config/database.js';

async function runMigration() {
  try {
    console.log('Running migration...');
    await up(sequelize.getQueryInterface());
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration(); 