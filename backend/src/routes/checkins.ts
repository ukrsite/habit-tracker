import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { eq, and } from 'drizzle-orm';
import { checkins, habits } from '../db/schema';
import { requireAuth } from '../middleware/requireAuth';
import { calculateStreaks } from '../utils/streaks';

/**
 * Get today's UTC date in YYYY-MM-DD format
 */
function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Check if a date string is in the future
 */
function isFutureDate(dateISO: string): boolean {
  const today = getTodayISO();
  return dateISO > today;
}

export async function checkinsRoutes(app: FastifyInstance, db: any): Promise<void> {
  // GET /habits/:id/checkins - get check-ins for a habit with optional month filter
  app.get<{ Params: { id: string }; Querystring: { month?: string } }>(
    '/habits/:id/checkins',
    { onRequest: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id: habitId } = request.params as { id: string };
      const { month } = request.query as { month?: string };
      const userId = request.session.userId as string;

      // Check if habit exists and belongs to user
      const habit = await db.query.habits.findFirst({
        where: and(eq(habits.id, habitId), eq(habits.userId, userId)),
      });

      if (!habit) {
        return reply.status(404).send({ error: 'Habit not found' });
      }

      // Get check-ins, optionally filtered by month
      let query = db.query.checkins
        .findMany({
          where: eq(checkins.habitId, habitId),
        })
        .orderBy((c: any) => c.date);

      if (month) {
        // month format: YYYY-MM
        const monthStart = month;
        const monthEnd = month + '-31'; // covers all days in any month
        query = db
          .select()
          .from(checkins)
          .where(
            and(
              eq(checkins.habitId, habitId),
              (c: any) => c.date >= monthStart && c.date <= monthEnd
            )
          )
          .orderBy((c: any) => c.date);
      }

      const allCheckins = await query;

      return reply.send(allCheckins);
    }
  );

  // POST /habits/:id/checkins - create a check-in
  app.post<{ Params: { id: string }; Body: { date: string } }>(
    '/habits/:id/checkins',
    { onRequest: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id: habitId } = request.params as { id: string };
      const { date } = request.body as { date: string };
      const userId = request.session.userId as string;

      // Validate date format
      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return reply.status(400).send({ error: 'Invalid date format, expected YYYY-MM-DD' });
      }

      // Check if habit exists and belongs to user
      const habit = await db.query.habits.findFirst({
        where: and(eq(habits.id, habitId), eq(habits.userId, userId)),
      });

      if (!habit) {
        return reply.status(404).send({ error: 'Habit not found' });
      }

      // Check if habit is active
      if (habit.status !== 'active') {
        return reply.status(422).send({ error: 'Habit is not active' });
      }

      // Check if date is in the future
      if (isFutureDate(date)) {
        return reply.status(422).send({ error: 'Cannot check in for a future date' });
      }

      // Check for duplicate
      const existing = await db.query.checkins.findFirst({
        where: and(eq(checkins.habitId, habitId), eq(checkins.date, date)),
      });

      if (existing) {
        return reply.status(409).send({ error: 'Check-in already exists for this date' });
      }

      // Create check-in
      const id = crypto.randomUUID();
      const checkin = {
        id,
        habitId,
        userId,
        date,
        createdAt: Math.floor(Date.now() / 1000),
      };

      await db.insert(checkins).values(checkin);

      return reply.status(201).send(checkin);
    }
  );

  // DELETE /habits/:id/checkins/:date - delete a check-in (only today's)
  app.delete<{ Params: { id: string; date: string } }>(
    '/habits/:id/checkins/:date',
    { onRequest: requireAuth },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id: habitId, date } = request.params as { id: string; date: string };
      const userId = request.session.userId as string;

      // Check if date is today
      const today = getTodayISO();
      if (date !== today) {
        return reply.status(422).send({ error: 'Can only delete today\'s check-in' });
      }

      // Check if habit exists and belongs to user
      const habit = await db.query.habits.findFirst({
        where: and(eq(habits.id, habitId), eq(habits.userId, userId)),
      });

      if (!habit) {
        return reply.status(404).send({ error: 'Habit not found' });
      }

      // Delete check-in
      const result = await db
        .delete(checkins)
        .where(and(eq(checkins.habitId, habitId), eq(checkins.date, date)));

      return reply.status(204).send();
    }
  );
}
