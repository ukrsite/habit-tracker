import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createApp } from '../src/app.js';

describe('Checkins CRUD - T3 & T4 (HTTP Level)', () => {
  let app: any;
  let cookie: string;
  let habitId: string;

  beforeAll(async () => {
    app = await createApp();

    // Login and create a habit
    const loginRes = await app.inject({
      method: 'POST',
      url: '/api/auth/demo-login',
      payload: {},
    });
    cookie = `${loginRes.cookies[0].name}=${loginRes.cookies[0].value}`;

    const habitRes = await app.inject({
      method: 'POST',
      url: '/api/habits',
      headers: { cookie },
      payload: {
        name: 'Test Habit',
        startDate: '2026-05-01',
        status: 'active',
      },
    });

    habitId = JSON.parse(habitRes.payload).id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('T3: POST check-in for today → 201. Duplicate → 409.', () => {
    it('should create check-in for today (POST → 201)', async () => {
      const today = new Date().toISOString().slice(0, 10);

      const res = await app.inject({
        method: 'POST',
        url: `/api/habits/${habitId}/checkins`,
        headers: { cookie },
        payload: { date: today },
      });

      expect(res.statusCode).toBe(201);
      const checkin = JSON.parse(res.payload);
      expect(checkin.habitId).toBe(habitId);
      expect(checkin.date).toBe(today);
    });

    it('should return 409 for duplicate check-in', async () => {
      const today = new Date().toISOString().slice(0, 10);

      // First check-in
      await app.inject({
        method: 'POST',
        url: `/api/habits/${habitId}/checkins`,
        headers: { cookie },
        payload: { date: today },
      });

      // Duplicate check-in
      const res = await app.inject({
        method: 'POST',
        url: `/api/habits/${habitId}/checkins`,
        headers: { cookie },
        payload: { date: today },
      });

      expect(res.statusCode).toBe(409);
      const error = JSON.parse(res.payload);
      expect(error.error).toContain('already exists');
    });

    it('should list check-ins for month', async () => {
      const res = await app.inject({
        method: 'GET',
        url: `/api/habits/${habitId}/checkins?month=2026-05`,
        headers: { cookie },
      });

      expect(res.statusCode).toBe(200);
      const checkins = JSON.parse(res.payload);
      expect(Array.isArray(checkins)).toBe(true);
    });

    it('should delete today\'s check-in (DELETE → 204)', async () => {
      const today = new Date().toISOString().slice(0, 10);

      // Create a check-in
      await app.inject({
        method: 'POST',
        url: `/api/habits/${habitId}/checkins`,
        headers: { cookie },
        payload: { date: today },
      });

      // Delete it
      const deleteRes = await app.inject({
        method: 'DELETE',
        url: `/api/habits/${habitId}/checkins/${today}`,
        headers: { cookie },
      });

      expect(deleteRes.statusCode).toBe(204);
    });
  });

  describe('T4: Validation - future date → 422, paused habit → 422', () => {
    it('should reject future-date check-in (POST → 422)', async () => {
      const tomorrow = new Date();
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      const tomorrowISO = tomorrow.toISOString().slice(0, 10);

      const res = await app.inject({
        method: 'POST',
        url: `/api/habits/${habitId}/checkins`,
        headers: { cookie },
        payload: { date: tomorrowISO },
      });

      expect(res.statusCode).toBe(422);
      const error = JSON.parse(res.payload);
      expect(error.error).toContain('future date');
    });

    it('should reject check-in on paused habit (POST → 422)', async () => {
      // Create a paused habit
      const pausedRes = await app.inject({
        method: 'POST',
        url: '/api/habits',
        headers: { cookie },
        payload: {
          name: 'Paused Habit',
          startDate: '2026-05-01',
          status: 'paused',
        },
      });
      const pausedHabitId = JSON.parse(pausedRes.payload).id;

      const today = new Date().toISOString().slice(0, 10);

      const res = await app.inject({
        method: 'POST',
        url: `/api/habits/${pausedHabitId}/checkins`,
        headers: { cookie },
        payload: { date: today },
      });

      expect(res.statusCode).toBe(422);
      const error = JSON.parse(res.payload);
      expect(error.error).toContain('not active');
    });

    it('should reject check-in on archived habit (POST → 422)', async () => {
      // Create and then archive a habit
      const archivedRes = await app.inject({
        method: 'POST',
        url: '/api/habits',
        headers: { cookie },
        payload: {
          name: 'Archived Habit',
          startDate: '2026-05-01',
          status: 'active',
        },
      });
      const archivedHabitId = JSON.parse(archivedRes.payload).id;

      // Archive it
      await app.inject({
        method: 'PATCH',
        url: `/api/habits/${archivedHabitId}`,
        headers: { cookie },
        payload: { status: 'archived' },
      });

      const today = new Date().toISOString().slice(0, 10);

      const res = await app.inject({
        method: 'POST',
        url: `/api/habits/${archivedHabitId}/checkins`,
        headers: { cookie },
        payload: { date: today },
      });

      expect(res.statusCode).toBe(422);
      const error = JSON.parse(res.payload);
      expect(error.error).toContain('not active');
    });
  });

  describe('Authorization: cross-user checkin access returns 403', () => {
    let user2Cookie: string;
    let user1HabitId: string;

    it('should create a second user for authorization tests', async () => {
      const loginRes = await app.inject({
        method: 'POST',
        url: '/api/auth/demo-login?testUser=checkin-auth',
        payload: {},
      });
      user2Cookie = `${loginRes.cookies[0].name}=${loginRes.cookies[0].value}`;
      expect(loginRes.statusCode).toBe(200);
    });

    it('should create an active habit for user 1', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/habits',
        headers: { cookie },
        payload: {
          name: 'User 1 Active Habit',
          startDate: '2026-05-01',
          status: 'active',
        },
      });
      expect(res.statusCode).toBe(201);
      user1HabitId = JSON.parse(res.payload).id;
    });

    it('should return 403 when user 2 tries to GET user 1 checkins', async () => {
      const res = await app.inject({
        method: 'GET',
        url: `/api/habits/${user1HabitId}/checkins`,
        headers: { cookie: user2Cookie },
      });
      expect(res.statusCode).toBe(403);
      expect(JSON.parse(res.payload).error).toBe('Forbidden');
    });

    it('should return 403 when user 2 tries to POST checkin to user 1 habit', async () => {
      const today = new Date().toISOString().slice(0, 10);
      const res = await app.inject({
        method: 'POST',
        url: `/api/habits/${user1HabitId}/checkins`,
        headers: { cookie: user2Cookie },
        payload: { date: today },
      });
      expect(res.statusCode).toBe(403);
      expect(JSON.parse(res.payload).error).toBe('Forbidden');
    });

    it('should return 403 when user 2 tries to DELETE checkin from user 1 habit', async () => {
      const today = new Date().toISOString().slice(0, 10);
      const res = await app.inject({
        method: 'DELETE',
        url: `/api/habits/${user1HabitId}/checkins/${today}`,
        headers: { cookie: user2Cookie },
      });
      expect(res.statusCode).toBe(403);
      expect(JSON.parse(res.payload).error).toBe('Forbidden');
    });
  });
});
