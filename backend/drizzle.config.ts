import type { Config } from 'drizzle-kit';
import * as path from 'path';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'better-sqlite',
  dbCredentials: {
    url: process.env.DATABASE_PATH || './data/habits.db',
  },
} satisfies Config;
