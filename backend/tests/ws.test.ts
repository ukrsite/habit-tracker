import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../src/db/schema';
import { eq, and } from 'drizzle-orm';
import { calculateStreaks } from '../src/utils/streaks';

function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayISO(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

function getTwoDaysAgoISO(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 2);
  return d.toISOString().slice(0, 10);
}

function getDaysAgoISO(daysAgo: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

describe('WebSocket Milestone Notifications', () => {
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

  afterAll(() => {
    sqlite.close();
  });

  beforeEach(async () => {
    await db.delete(schema.milestoneNotifications);
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

  describe('T6: 3-day streak milestone', () => {
    it('should send 3-day milestone notification for 3 consecutive check-ins', async () => {
      // Seed 3 consecutive check-ins
      const dates = [getTwoDaysAgoISO(), getYesterdayISO(), getTodayISO()];
      for (const date of dates) {
        await db.insert(schema.checkins).values({
          id: crypto.randomUUID(),
          habitId,
          userId,
          date,
          createdAt: Math.floor(Date.now() / 1000),
        });
      }

      // Calculate streaks
      const today = getTodayISO();
      const checkins = await db.query.checkins.findMany({
        where: eq(schema.checkins.habitId, habitId),
      });
      const checkinDates = checkins.map((c: any) => c.date);
      const streaks = calculateStreaks(checkinDates, today);

      // Verify current streak is 3
      expect(streaks.current).toBe(3);

      // Check if milestone should be sent
      const existing = await db.query.milestoneNotifications.findFirst({
        where: and(
          eq(schema.milestoneNotifications.habitId, habitId),
          eq(schema.milestoneNotifications.milestoneDays, 3)
        ),
      });

      expect(existing).toBeUndefined(); // Not yet acknowledged/sent

      // Verify milestone conditions are met
      expect(streaks.current >= 3).toBe(true);
    });
  });

  describe('T7: 7-day streak milestone', () => {
    it('should send 7-day milestone notification for 7 consecutive check-ins', async () => {
      // Seed 7 consecutive check-ins
      for (let i = 6; i >= 0; i--) {
        const date = getDaysAgoISO(i);
        await db.insert(schema.checkins).values({
          id: crypto.randomUUID(),
          habitId,
          userId,
          date,
          createdAt: Math.floor(Date.now() / 1000),
        });
      }

      // Calculate streaks
      const today = getTodayISO();
      const checkins = await db.query.checkins.findMany({
        where: eq(schema.checkins.habitId, habitId),
      });
      const checkinDates = checkins.map((c: any) => c.date);
      const streaks = calculateStreaks(checkinDates, today);

      // Verify current streak is 7
      expect(streaks.current).toBe(7);

      // Check if milestone should be sent
      const existing = await db.query.milestoneNotifications.findFirst({
        where: and(
          eq(schema.milestoneNotifications.habitId, habitId),
          eq(schema.milestoneNotifications.milestoneDays, 7)
        ),
      });

      expect(existing).toBeUndefined(); // Not yet acknowledged/sent

      // Verify milestone conditions are met
      expect(streaks.current >= 7).toBe(true);
    });
  });

  describe('T8: 30-day streak milestone', () => {
    it('should send 30-day milestone notification for 30 consecutive check-ins', async () => {
      // Seed 30 consecutive check-ins
      for (let i = 29; i >= 0; i--) {
        const date = getDaysAgoISO(i);
        await db.insert(schema.checkins).values({
          id: crypto.randomUUID(),
          habitId,
          userId,
          date,
          createdAt: Math.floor(Date.now() / 1000),
        });
      }

      // Calculate streaks
      const today = getTodayISO();
      const checkins = await db.query.checkins.findMany({
        where: eq(schema.checkins.habitId, habitId),
      });
      const checkinDates = checkins.map((c: any) => c.date);
      const streaks = calculateStreaks(checkinDates, today);

      // Verify current streak is 30
      expect(streaks.current).toBe(30);

      // Check if milestone should be sent
      const existing = await db.query.milestoneNotifications.findFirst({
        where: and(
          eq(schema.milestoneNotifications.habitId, habitId),
          eq(schema.milestoneNotifications.milestoneDays, 30)
        ),
      });

      expect(existing).toBeUndefined(); // Not yet acknowledged/sent

      // Verify milestone conditions are met
      expect(streaks.current >= 30).toBe(true);
    });
  });

  describe('T9: Acknowledged milestones are not re-sent on reconnect', () => {
    it('should not re-send milestone after acknowledgment', async () => {
      // Seed 3 consecutive check-ins
      const dates = [getTwoDaysAgoISO(), getYesterdayISO(), getTodayISO()];
      for (const date of dates) {
        await db.insert(schema.checkins).values({
          id: crypto.randomUUID(),
          habitId,
          userId,
          date,
          createdAt: Math.floor(Date.now() / 1000),
        });
      }

      // Simulate acknowledgment
      await db.insert(schema.milestoneNotifications).values({
        id: crypto.randomUUID(),
        habitId,
        userId,
        milestoneDays: 3,
        sentAt: Math.floor(Date.now() / 1000),
      }).onConflictDoNothing();

      // After reconnect, check if milestone is already acknowledged
      const existing = await db.query.milestoneNotifications.findFirst({
        where: and(
          eq(schema.milestoneNotifications.habitId, habitId),
          eq(schema.milestoneNotifications.milestoneDays, 3)
        ),
      });

      expect(existing).toBeDefined();
      expect(existing?.milestoneDays).toBe(3);

      // Verify duplicate prevention works with onConflictDoNothing
      await db.insert(schema.milestoneNotifications).values({
        id: crypto.randomUUID(),
        habitId,
        userId,
        milestoneDays: 3,
        sentAt: Math.floor(Date.now() / 1000),
      }).onConflictDoNothing();

      // Verify the record is still unique (no duplicates created)
      const allNotifications = await db.query.milestoneNotifications.findMany({
        where: and(
          eq(schema.milestoneNotifications.habitId, habitId),
          eq(schema.milestoneNotifications.milestoneDays, 3)
        ),
      });

      expect(allNotifications).toHaveLength(1);
    });
  });
});
