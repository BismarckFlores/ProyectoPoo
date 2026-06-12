import path from 'node:path';
import dotenv from 'dotenv';

// Works for both tsx (src/config) and compiled JS (dist/config)
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

export type AppEnv = {
  port: number;
  webOrigin: string;
  databaseUrl?: string;
  pgConnection?: string;
  pgHost?: string;
  pgPort?: number;
  pgUser?: string;
  pgPassword?: string;
  pgDatabase?: string;
};

export const env: AppEnv = {
  port: Number(process.env.PORT || 3000),
  webOrigin: process.env.WEB_ORIGIN || 'http://localhost:4000',
  databaseUrl: process.env.DATABASE_URL,
  pgConnection: process.env.PG_CONNECTION,
  pgHost: process.env.PGHOST,
  pgPort: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : undefined,
  pgUser: process.env.PGUSER,
  pgPassword: process.env.PGPASSWORD,
  pgDatabase: process.env.PGDATABASE,
};

