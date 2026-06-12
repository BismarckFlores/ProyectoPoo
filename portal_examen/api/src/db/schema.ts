import { Pool } from 'pg';

export async function ensureSchema(pool: Pool): Promise<void> {
  const createSql = `
    CREATE TABLE IF NOT EXISTS submissions (
      id SERIAL PRIMARY KEY,
      name TEXT,
      score INTEGER,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(createSql);
}

