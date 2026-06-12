import { Pool, PoolConfig } from 'pg';
import { env } from '../config/env';

export function createPool(): Pool {
  const connectionString = env.databaseUrl || env.pgConnection;

  if (connectionString) {
    return new Pool({ connectionString });
  }

  if (env.pgHost || env.pgDatabase) {
    const cfg: PoolConfig = {
      host: env.pgHost || 'localhost',
      port: env.pgPort,
      user: env.pgUser,
      password: env.pgPassword,
      database: env.pgDatabase,
    };
    return new Pool(cfg);
  }

  throw new Error('No PostgreSQL configuration found. Set DATABASE_URL or PGHOST/PGDATABASE (or PG_CONNECTION).');
}

