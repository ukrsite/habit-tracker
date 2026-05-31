import { FastifyInstance } from 'fastify';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { eq, and, like, or, inArray } from 'drizzle-orm';
import * as schema from '../db/schema.ts';
import { requireAuth } from '../middleware/requireAuth.ts';
import { calculateStreaks } from '../utils/streaks.ts';
import { randomUUID } from 'node:crypto';

export default async function habitsRoutes(app: FastifyInstance, db: any) {
  // GET / - List all habits with optional filters
  app.get(
    '/',
    { onRequest: requireAuth },
    async (request, reply) => {
      const userId = request.session.userId;
      const { status, q, completedToday } = request.query as {
        status?: string;
        q?: string;
        completedToday?: string;
      };

      if (!userId) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const conditions: any[] = [eq(schema.habits.userId, userId)];

      // Filter by status if provided
      if (status && ['active', 'paused', 'archived'].includes(status)) {
        conditions.push(eq(schema.habits.status, status as 'active' | 'paused' | 'archived'));
      }

      // Filter by search text if provided
      if (q) {
        conditions.push(or(like(schema.habits.name, `%${q}%`), like(schema.habits.description, `%${q}%`)));
      }

      const query = db
        .select()
        .from(schema.habits)
        .where(and(...conditions));

      const allHabits = query.all();

      // Enrich habits with streak data and completedToday flag
      const today = new Date().toISOString().slice(0, 10);
      const enrichedHabits = allHabits.map((habit: any) => {
        const checkins = db
          .select({ date: schema.checkins.date })
          .from(schema.checkins)
          .where(eq(schema.checkins.habitId, habit.id))
          .all();

        const dates = checkins.map((c: any) => c.date);
        const streaks = calculateStreaks(dates, today);
        const completedToday = dates.includes(today);

        return {
          ...habit,
          currentStreak: streaks.current,
          bestStreak: streaks.best,
          totalCheckins: streaks.total,
          completedToday,
        };
      });

      // Filter by completedToday if provided
      if (completedToday !== undefined) {
        const completedTodayHabits = db
          .select({ habitId: schema.checkins.habitId })
          .from(schema.checkins)
          .where(
            and(
              eq(schema.checkins.userId, userId),
              eq(schema.checkins.date, today)
            )
          )
          .all()
          .map((c: any) => c.habitId);

        if (completedToday === 'true') {
          return reply.send(
            enrichedHabits.filter((h: any) => completedTodayHabits.includes(h.id))
          );
        } else if (completedToday === 'false') {
          return reply.send(
            enrichedHabits.filter((h: any) => !completedTodayHabits.includes(h.id))
          );
        }
      }

      return reply.send(enrichedHabits);
    }
  );

  // POST / - Create a new habit
  app.post(
    '/',
    { onRequest: requireAuth },
    async (request, reply) => {
      const userId = request.session.userId;
      const { name, description, startDate, status } = request.body as {
        name: string;
        description?: string;
        startDate: string;
        status?: string;
      };

      // Validate required fields
      if (!name || !startDate) {
        return reply.status(400).send({
          error: 'name and startDate are required',
        });
      }

      const now = Math.floor(Date.now() / 1000);
      const habitId = randomUUID();

      try {
        const result = db
          .insert(schema.habits)
          .values({
            id: habitId,
            userId,
            name,
            description: description || null,
            startDate,
            status: status || 'active',
            createdAt: now,
            updatedAt: now,
          })
          .run();

        const habit = db
          .select()
          .from(schema.habits)
          .where(eq(schema.habits.id, habitId))
          .get();

        return reply.status(201).send(habit);
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );

  // GET /habits/:id - Get a specific habit with streaks
  app.get(
    '/:id',
    { onRequest: requireAuth },
    async (request, reply) => {
      const userId = request.session.userId;
      const { id } = request.params as { id: string };

      const habit = db
        .select()
        .from(schema.habits)
        .where(eq(schema.habits.id, id))
        .get();

      if (!habit) {
        return reply.status(404).send({ error: 'Not found' });
      }

      if (habit.userId !== userId) {
        return reply.status(403).send({ error: 'Forbidden' });
      }

      // Get all checkins for this habit
      const checkins = db
        .select({ date: schema.checkins.date })
        .from(schema.checkins)
        .where(eq(schema.checkins.habitId, id))
        .all();

      const dates = checkins.map((c: any) => c.date);
      const today = new Date().toISOString().slice(0, 10);
      const streaks = calculateStreaks(dates, today);

      return reply.send({
        ...habit,
        currentStreak: streaks.current,
        bestStreak: streaks.best,
        totalCheckins: streaks.total,
      });
    }
  );

  // PATCH /habits/:id - Update a habit
  app.patch(
    '/:id',
    { onRequest: requireAuth },
    async (request, reply) => {
      const userId = request.session.userId;
      const { id } = request.params as { id: string };
      const { name, description, status } = request.body as {
        name?: string;
        description?: string;
        status?: string;
      };

      const habit = db
        .select()
        .from(schema.habits)
        .where(eq(schema.habits.id, id))
        .get();

      if (!habit) {
        return reply.status(404).send({ error: 'Not found' });
      }

      if (habit.userId !== userId) {
        return reply.status(403).send({ error: 'Forbidden' });
      }

      // Validate status transitions if provided
      if (status) {
        const currentStatus = habit.status;
        const isValidTransition =
          (currentStatus === 'active' && (status === 'paused' || status === 'archived')) ||
          (currentStatus === 'paused' && (status === 'active' || status === 'archived')) ||
          status === currentStatus;

        if (!isValidTransition) {
          return reply.status(422).send({
            error: `Cannot transition from ${currentStatus} to ${status}`,
          });
        }
      }

      const now = Math.floor(Date.now() / 1000);
      const updateData: any = { updatedAt: now };

      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (status !== undefined) updateData.status = status;

      try {
        db
          .update(schema.habits)
          .set(updateData)
          .where(eq(schema.habits.id, id))
          .run();

        const updated = db
          .select()
          .from(schema.habits)
          .where(eq(schema.habits.id, id))
          .get();

        return reply.send(updated);
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );

  // DELETE /habits/:id - Delete a habit
  app.delete(
    '/:id',
    { onRequest: requireAuth },
    async (request, reply) => {
      const userId = request.session.userId;
      const { id } = request.params as { id: string };

      const habit = db
        .select()
        .from(schema.habits)
        .where(eq(schema.habits.id, id))
        .get();

      if (!habit) {
        return reply.status(404).send({ error: 'Not found' });
      }

      if (habit.userId !== userId) {
        return reply.status(403).send({ error: 'Forbidden' });
      }

      try {
        db
          .delete(schema.habits)
          .where(eq(schema.habits.id, id))
          .run();

        return reply.status(204).send();
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }
  );
}
