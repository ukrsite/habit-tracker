import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

export function runMigrations(dbPath: string) {
  // Create directory if it doesn't exist
  const dir = dirname(dbPath);
  mkdirSync(dir, { recursive: true });

  const db = new Database(dbPath);

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create tables directly from SQL
  const statements = [
    `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      provider TEXT NOT NULL,
      provider_user_id TEXT NOT NULL,
      email TEXT,
      display_name TEXT NOT NULL,
      avatar_url TEXT,
      created_at INTEGER NOT NULL,
      UNIQUE(provider, provider_user_id)
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT,
      start_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS checkins (
      id TEXT PRIMARY KEY,
      habit_id TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      UNIQUE(habit_id, date)
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS milestone_notifications (
      id TEXT PRIMARY KEY,
      habit_id TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      milestone_days INTEGER NOT NULL,
      sent_at INTEGER NOT NULL,
      UNIQUE(habit_id, milestone_days)
    )
    `,
  ];

  for (const statement of statements) {
    db.exec(statement);
  }

  console.log('Database tables created successfully');
  db.close();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dbPath = process.env.DATABASE_PATH || './data/habits.db';
  runMigrations(dbPath);
}
