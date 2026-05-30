import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema.ts';
import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'fs';
import { dirname } from 'path';


export function seedDatabase(dbPath: string) {
  // Create directory if it doesn't exist
  const dir = dirname(dbPath);
  mkdirSync(dir, { recursive: true });

  const db = new Database(dbPath);
  const drizzleDb = drizzle(db, { schema });

  // Check if sample user already exists
  const existingUser = drizzleDb.query.users.findFirst({
    where: (t: any) => t.provider === 'google' && t.providerUserId === 'sample-google-user',
  });

  if (existingUser) {
    console.log('Sample data already exists, skipping seed');
    db.close();
    return;
  }

  // Create a sample user
  const userId = randomUUID();
  const now = Math.floor(Date.now() / 1000);

  drizzleDb.insert(schema.users).values({
    id: userId,
    provider: 'google',
    providerUserId: 'sample-google-user',
    email: 'sample@example.com',
    displayName: 'Sample User',
    avatarUrl: 'https://example.com/avatar.jpg',
    createdAt: now,
  }).run();

  // Create 3 habits
  const habit1Id = randomUUID();
  const habit2Id = randomUUID();
  const habit3Id = randomUUID();

  const today = new Date();
  const todayISO = today.toISOString().slice(0, 10);

  drizzleDb.insert(schema.habits).values([
    {
      id: habit1Id,
      userId,
      name: 'Morning Run',
      description: 'Run 5km every morning',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: habit2Id,
      userId,
      name: 'Read a Book',
      description: 'Read for 30 minutes',
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: habit3Id,
      userId,
      name: 'Meditation',
      description: 'Meditate for 10 minutes',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
  ]).run();

  // Create check-ins for habit1 (10 consecutive days - for 7 and 3 day milestones)
  const habit1CheckIns = [];
  for (let i = 9; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    habit1CheckIns.push({
      id: randomUUID(),
      habitId: habit1Id,
      userId,
      date,
      createdAt: now,
    });
  }
  drizzleDb.insert(schema.checkins).values(habit1CheckIns).run();

  // Create check-ins for habit2 (5 consecutive days - for 3 day milestone)
  const habit2CheckIns = [];
  for (let i = 4; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    habit2CheckIns.push({
      id: randomUUID(),
      habitId: habit2Id,
      userId,
      date,
      createdAt: now,
    });
  }
  drizzleDb.insert(schema.checkins).values(habit2CheckIns).run();

  // Create check-ins for habit3 (2 days - no milestones yet)
  const habit3CheckIns = [];
  for (let i = 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    habit3CheckIns.push({
      id: randomUUID(),
      habitId: habit3Id,
      userId,
      date,
      createdAt: now,
    });
  }
  drizzleDb.insert(schema.checkins).values(habit3CheckIns).run();

  console.log('Database seeded with sample data');
  db.close();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dbPath = process.env.DATABASE_PATH || './data/habits.db';
  seedDatabase(dbPath);
}
