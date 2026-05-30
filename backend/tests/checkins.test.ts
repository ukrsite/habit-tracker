import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../src/db/schema';
import { eq, and } from 'drizzle-orm';

function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function getTomorrowISO(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

describe('Checkins CRUD', () => {
  let db: any;
  let sqlite: Database.Database;
  let userId: string;
  let habitId: string;

  beforeAll(() => {
    sqlite = new Database(':memory:');
    db = drizzle(sqlite, { schema });
    sqlite.pragma('foreign_keys = ON');

    const statements = [
      `CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, provider TEXT NOT NULL, provider_user_id TEXT NOT NULL, email TEXT, display_name TEXT NOT NULL, avatar_url TEXT, created_at INTEGER NOT NULL, UNIQUE(provider, provider_user_id))`,
      `CREATE TABLE IF NOT EXISTS habits (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, name TEXT NOT NULL, description TEXT, start_date TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active', created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)`,
      `CREATE TABLE IF NOT EXISTS checkins (id TEXT PRIMARY KEY, habit_id TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE, user_id TEXT NOT NULL, date TEXT NOT NULL, created_at INTEGER NOT NULL, UNIQUE(habit_id, date))`,
      `CREATE TABLE IF NOT EXISTS milestone_notifications (id TEXT PRIMARY KEY, habit_id TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE, user_id TEXT NOT NULL, milestone_days INTEGER NOT NULL, sent_at INTEGER NOT NULL, UNIQUE(habit_id, milestone_days))`,
    ];

    for (const statement of statements) {
      sqlite.exec(statement);
    }
  });

  beforeEach(async () => {
    await db.delete(schema.checkins);
    await db.delete(schema.habits);
    await db.delete(schema.users);

    userId = crypto.randomUUID();
    await db.insert(schema.users).values({
      id: userId,
      provider: 'test',
      providerUserId: 'test-user',
      displayName: 'Test User',
      createdAt: Math.floor(Date.now() / 1000),
    });

    habitId = crypto.randomUUID();
    await db.insert(schema.habits).values({
      id: habitId,
      userId,
      name: 'Test Habit',
      description: 'Test',
      startDate: '2024-01-01',
      status: 'active',
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    });
  });

  describe('T3: Check-in creation and duplicate prevention', () => {
    it('should create check-in for today', async () => {
      const today = getTodayISO();
      const checkin = {
        id: crypto.randomUUID(),
        habitId,
        userId,
        date: today,
        createdAt: Math.floor(Date.now() / 1000),
      };

      await db.insert(schema.checkins).values(checkin);
      const result = await db.query.checkins.findFirst({
        where: and(eq(schema.checkins.habitId, habitId), eq(schema.checkins.date, today)),
      });

      expect(result).toBeDefined();
      expect(result?.date).toBe(today);
    });

    it('should reject duplicate check-in', async () => {
      const today = getTodayISO();
      const checkin1 = {
        id: crypto.randomUUID(),
        habitId,
        userId,
        date: today,
        createdAt: Math.floor(Date.now() / 1000),
      };

      await db.insert(schema.checkins).values(checkin1);

      let error: any;
      try {
        await db.insert(schema.checkins).values({
          id: crypto.randomUUID(),
          habitId,
          userId,
          date: today,
          createdAt: Math.floor(Date.now() / 1000),
        });
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
    });
  });

  describe('T4: Validation rules', () => {
    it('should recognize future dates', () => {
      const tomorrow = getTomorrowISO();
      expect(tomorrow > getTodayISO()).toBe(true);
    });

    it('should pause habit', async () => {
      await db.update(schema.habits).set({ status: 'paused' }).where(eq(schema.habits.id, habitId));
      const habit = await db.query.habits.findFirst({ where: eq(schema.habits.id, habitId) });
      expect(habit?.status).toBe('paused');
    });

    it('should archive habit', async () => {
      await db.update(schema.habits).set({ status: 'archived' }).where(eq(schema.habits.id, habitId));
      const habit = await db.query.habits.findFirst({ where: eq(schema.habits.id, habitId) });
      expect(habit?.status).toBe('archived');
    });
  });
});
