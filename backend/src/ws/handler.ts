import { FastifyRequest } from 'fastify';
import { WebSocket } from 'ws';
import { db } from '../app.js';
import { eq, and } from 'drizzle-orm';
import * as schema from '../db/schema.js';
import { calculateStreaks } from '../utils/streaks.js';
import { randomUUID } from 'crypto';

interface Message {
  type: string;
  payload: Record<string, any>;
}

export default async function wsHandler(socket: WebSocket, request: FastifyRequest) {
  try {
    // Auth check is now at the route level via preValidation
    const userId = request.session.userId as string;

    // Send connected message
    const connectedMsg: Message = {
      type: 'connected',
      payload: { userId },
    };
    socket.send(JSON.stringify(connectedMsg));

    // Handle incoming messages
    socket.on('message', async (data: Buffer) => {
      try {
        const message: Message = JSON.parse(data.toString());

        if (message.type === 'subscribe') {
          // Handle subscribe message
          await handleSubscribe(socket, userId);
        } else if (message.type === 'ack') {
          // Handle ack message
          await handleAck(message.payload, userId);
        }
      } catch (error) {
        console.error('[WS] Message error:', error);
      }
    });

    socket.on('error', (error: any) => {
      console.error('[WS] Socket error:', error);
    });
  } catch (error) {
    console.error('[WS] Handler error:', error);
    try {
      socket.close(1011, 'Internal server error');
    } catch (closeError) {
      // Socket close failed, ignore
    }
  }
}

async function handleSubscribe(socket: WebSocket, userId: string) {
  try {
    // Load all habits for the user
    const habits = await db.query.habits.findMany({
      where: eq(schema.habits.userId, userId),
    });

    const today = new Date().toISOString().slice(0, 10);

    // Check each habit for milestones
    for (const habit of habits) {
      // Get all checkins for this habit
      const checkins = await db.query.checkins.findMany({
        where: eq(schema.checkins.habitId, habit.id),
      });

      const dates = checkins.map((c: any) => c.date);
      const streaks = calculateStreaks(dates, today);

      // Check milestones: 3, 7, 30
      const milestones = [3, 7, 30];
      for (const milestone of milestones) {
        if (streaks.current >= milestone) {
          // Check if this milestone has already been acknowledged
          const existing = await db.query.milestoneNotifications.findFirst({
            where: and(eq(schema.milestoneNotifications.habitId, habit.id), eq(schema.milestoneNotifications.milestoneDays, milestone)),
          });

          if (!existing) {
            // Send milestone message
            const milestoneMsg: Message = {
              type: 'milestone',
              payload: {
                habitId: habit.id,
                habitName: habit.name,
                milestoneDays: milestone,
                currentStreak: streaks.current,
              },
            };
            socket.send(JSON.stringify(milestoneMsg));
          }
        }
      }
    }
  } catch (error) {
    console.error('[WS] Error handling subscribe:', error);
  }
}

async function handleAck(payload: Record<string, any>, userId: string) {
  try {
    const { habitId, milestoneDays } = payload;

    if (!habitId || !milestoneDays) {
      return;
    }

    // Verify ownership: only user who owns the habit can ack
    const habit = await db.query.habits.findFirst({
      where: eq(schema.habits.id, habitId),
    });

    if (!habit || habit.userId !== userId) {
      return;
    }

    // Insert into milestone_notifications (INSERT OR IGNORE)
    // The UNIQUE constraint will prevent duplicates
    await db.insert(schema.milestoneNotifications).values({
      id: randomUUID(),
      habitId,
      userId,
      milestoneDays,
      sentAt: Math.floor(Date.now() / 1000),
    }).onConflictDoNothing();
  } catch (error) {
    console.error('Error handling ack:', error);
  }
}
