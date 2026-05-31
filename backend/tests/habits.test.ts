import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createApp } from '../src/app.js';

describe('Habits CRUD Operations - T2 & T5 (HTTP Level)', () => {
  let app: any;
  let cookie: string;
  let userId: string;

  beforeAll(async () => {
    app = await createApp();

    // Login once for all tests
    const loginRes = await app.inject({
      method: 'POST',
      url: '/api/auth/demo-login',
      payload: {},
    });
    cookie = `${loginRes.cookies[0].name}=${loginRes.cookies[0].value}`;
    userId = JSON.parse(loginRes.payload).userId;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('T2: POST /habits → 201. GET /habits returns it.', () => {
    let habitId: string;

    it('should create a new habit (POST → 201)', async () => {
      // Create a habit
      const res = await app.inject({
        method: 'POST',
        url: '/api/habits',
        headers: { cookie },
        payload: {
          name: 'Morning Run',
          description: 'Run 5km every morning',
          startDate: '2026-05-01',
          status: 'active',
        },
      });

      expect(res.statusCode).toBe(201);
      const habit = JSON.parse(res.payload);
      expect(habit.id).toBeDefined();
      expect(habit.name).toBe('Morning Run');
      expect(habit.status).toBe('active');
      habitId = habit.id;
    });

    it('should retrieve habits in list (GET /habits → 200)', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/habits',
        headers: { cookie },
      });

      expect(res.statusCode).toBe(200);
      const habits = JSON.parse(res.payload);
      expect(Array.isArray(habits)).toBe(true);
      expect(habits.some((h: any) => h.id === habitId)).toBe(true);
    });

    it('should filter habits by status', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/habits?status=active',
        headers: { cookie },
      });

      expect(res.statusCode).toBe(200);
      const habits = JSON.parse(res.payload);
      expect(habits.every((h: any) => h.status === 'active')).toBe(true);
    });

    it('should search by name and description', async () => {
      // Search by name
      const nameRes = await app.inject({
        method: 'GET',
        url: '/api/habits?q=Morning',
        headers: { cookie },
      });
      expect(nameRes.statusCode).toBe(200);
      const byName = JSON.parse(nameRes.payload);
      expect(byName.length).toBeGreaterThan(0);
      expect(byName.some((h: any) => h.name.includes('Morning'))).toBe(true);

      // Search by description
      const descRes = await app.inject({
        method: 'GET',
        url: '/api/habits?q=5km',
        headers: { cookie },
      });
      expect(descRes.statusCode).toBe(200);
      const byDesc = JSON.parse(descRes.payload);
      expect(byDesc.length).toBeGreaterThan(0);
      expect(byDesc.some((h: any) => h.description?.includes('5km'))).toBe(true);
    });

    it('should include streak data in GET /habits/:id', async () => {
      const res = await app.inject({
        method: 'GET',
        url: `/api/habits/${habitId}`,
        headers: { cookie },
      });

      expect(res.statusCode).toBe(200);
      const habit = JSON.parse(res.payload);
      expect(habit.currentStreak).toBeDefined();
      expect(habit.bestStreak).toBeDefined();
      expect(habit.totalCheckins).toBeDefined();
    });
  });

  describe('T5: Authorization - accessing non-existent habit', () => {
    it('should return 404 when accessing non-existent habit', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/habits/00000000-0000-0000-0000-000000000000',
        headers: { cookie },
      });

      expect(res.statusCode).toBe(404);
    });

    it('should verify authorization middleware is in place', async () => {
      // POST without auth should return 401
      const res = await app.inject({
        method: 'POST',
        url: '/api/habits',
        payload: {
          name: 'Unauthorized Habit',
          startDate: '2026-05-01',
        },
      });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('Status transitions', () => {
    let transitionHabitId: string;

    it('should create habit for transition tests', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/habits',
        headers: { cookie },
        payload: {
          name: 'Transition Habit',
          startDate: '2026-05-01',
          status: 'active',
        },
      });

      expect(res.statusCode).toBe(201);
      transitionHabitId = JSON.parse(res.payload).id;
    });

    it('should allow transition from active to paused', async () => {
      const res = await app.inject({
        method: 'PATCH',
        url: `/api/habits/${transitionHabitId}`,
        headers: { cookie },
        payload: { status: 'paused' },
      });

      expect(res.statusCode).toBe(200);
      const updated = JSON.parse(res.payload);
      expect(updated.status).toBe('paused');
    });

    it('should allow transition from paused to archived', async () => {
      const res = await app.inject({
        method: 'PATCH',
        url: `/api/habits/${transitionHabitId}`,
        headers: { cookie },
        payload: { status: 'archived' },
      });

      expect(res.statusCode).toBe(200);
      const updated = JSON.parse(res.payload);
      expect(updated.status).toBe('archived');
    });

    it('should reject transition from archived to active (422)', async () => {
      const res = await app.inject({
        method: 'PATCH',
        url: `/api/habits/${transitionHabitId}`,
        headers: { cookie },
        payload: { status: 'active' },
      });

      expect(res.statusCode).toBe(422);
      const error = JSON.parse(res.payload);
      expect(error.error).toContain('Cannot transition');
    });
  });
});
