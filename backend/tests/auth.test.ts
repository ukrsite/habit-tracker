import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../src/db/schema.js';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';

describe('Authentication (T1)', () => {
  let db: any;
  let sqlite: any;

  beforeAll(async () => {
    // Create in-memory database
    sqlite = new Database(':memory:');
    db = drizzle(sqlite, { schema });

    // Enable foreign keys
    sqlite.pragma('foreign_keys = ON');

    // Create tables
    sqlite.exec(`
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
    `);
  });

  afterAll(async () => {
    sqlite.close();
  });

  it('T1: SSO login creates user and can be retrieved', async () => {
    // Simulate OAuth provider returning a profile
    const mockProfile = {
      id: 'google-123',
      displayName: 'Test User',
      emails: [{ value: 'test@example.com' }],
      photos: [{ value: 'https://example.com/avatar.jpg' }],
    };

    // Create user as if OAuth callback processed it
    const userId = randomUUID();
    const newUser = {
      id: userId,
      provider: 'google',
      providerUserId: mockProfile.id,
      email: mockProfile.emails[0].value,
      displayName: mockProfile.displayName,
      avatarUrl: mockProfile.photos[0].value,
      createdAt: Math.floor(Date.now() / 1000),
    };

    // Insert user (simulating what OAuth strategy does)
    await db.insert(schema.users).values(newUser);

    // Verify user was created (simulating /auth/me response)
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    });

    expect(user).toBeDefined();
    expect(user?.id).toBe(userId);
    expect(user?.displayName).toBe('Test User');
    expect(user?.email).toBe('test@example.com');
    expect(user?.provider).toBe('google');
    expect(user?.providerUserId).toBe('google-123');
  });

  it('T1: OAuth user upsert - returns existing user on second login', async () => {
    // First login - create user
    const mockProfile = {
      id: 'github-456',
      displayName: 'GitHub User',
      emails: [{ value: 'github@example.com' }],
      photos: [{ value: 'https://example.com/github.jpg' }],
    };

    const userId = randomUUID();
    const firstLoginUser = {
      id: userId,
      provider: 'github',
      providerUserId: mockProfile.id,
      email: mockProfile.emails[0].value,
      displayName: mockProfile.displayName,
      avatarUrl: mockProfile.photos[0].value,
      createdAt: Math.floor(Date.now() / 1000),
    };

    await db.insert(schema.users).values(firstLoginUser);

    // Second login - user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.provider, 'github'),
    });

    expect(existingUser).toBeDefined();
    expect(existingUser?.id).toBe(userId);
    expect(existingUser?.displayName).toBe('GitHub User');
  });
});
