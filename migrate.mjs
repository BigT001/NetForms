// migrate.js
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL_CONFIG);
const db = drizzle(sql);

async function main() {
  try {
    await migrate(db, { migrationsFolder: './migrations' });
    console.log('Migration complete');
  } catch (error) {
    console.error('Migration failed', error);
  }
  process.exit(0);
}

main();
