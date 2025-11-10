const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function migrate() {
  try {
    console.log('Creating migrations table...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        version VARCHAR(50) NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const version = '001_initial_schema';
    
    const existing = await pool.query(
      'SELECT * FROM schema_migrations WHERE version = $1',
      [version]
    );

    if (existing.rows.length > 0) {
      console.log('✓ Migration already applied');
      process.exit(0);
    }

    console.log('Running migration...');
    const schema = fs.readFileSync('./src/infrastructure/db/schema.sql', 'utf8');
    await pool.query(schema);
    
    await pool.query(
      'INSERT INTO schema_migrations (version) VALUES ($1)',
      [version]
    );
    
    console.log('✓ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
