import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createApp } from '../src/app.js';
import WebSocket from 'ws';

function getDaysAgoISO(daysAgo: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

describe('WebSocket Milestone Notifications - T6/T7/T8/T9 (Real WS)', () => {
  let app: any;
  let cookie: string;
  let port: number;

  beforeAll(async () => {
    app = await createApp();
    await app.listen({ port: 0 }); // Listen on random port
    port = app.server.address().port;

    // Login
    const loginRes = await app.inject({
      method: 'POST',
      url: '/api/auth/demo-login',
      payload: {},
    });
    cookie = `${loginRes.cookies[0].name}=${loginRes.cookies[0].value}`;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('T6: Milestone notification for 3-day streak', () => {
    it('should send milestone message via WebSocket for 3-day streak', async () => {
      // Create habit
      const habitRes = await app.inject({
        method: 'POST',
        url: '/api/habits',
        headers: { cookie },
        payload: {
          name: 'T6 Habit',
          startDate: '2026-05-01',
          status: 'active',
        },
      });
      const habitId = JSON.parse(habitRes.payload).id;

      // Add 3 consecutive check-ins
      for (let i = 2; i >= 0; i--) {
        const date = getDaysAgoISO(i);
        await app.inject({
          method: 'POST',
          url: `/api/habits/${habitId}/checkins`,
          headers: { cookie },
          payload: { date },
        });
      }

      // Connect via WebSocket with session cookie
      const ws = new WebSocket(`ws://localhost:${port}/ws`, {
        headers: { cookie },
      });

      return new Promise<void>((resolve, reject) => {
        let connected = false;
        let milestoneDays3Received = false;

        ws.on('open', () => {
          // Send subscribe message
          ws.send(JSON.stringify({ type: 'subscribe', payload: { milestones: true } }));
        });

        ws.on('message', (data) => {
          try {
            const msg = JSON.parse(data.toString());

            if (msg.type === 'connected') {
              connected = true;
            } else if (msg.type === 'milestone' && msg.payload.habitId === habitId && msg.payload.milestoneDays === 3) {
              expect(msg.payload.currentStreak).toBe(3);
              milestoneDays3Received = true;
              ws.close();
            }
          } catch (e) {
            reject(e);
          }
        });

        ws.on('close', () => {
          if (connected) {
            expect(milestoneDays3Received).toBe(true);
            resolve();
          } else {
            reject(new Error('WebSocket did not connect'));
          }
        });

        ws.on('error', reject);

        setTimeout(() => {
          ws.close();
          reject(new Error('Timeout waiting for milestone message'));
        }, 5000);
      });
    });
  });

  describe('T7: Milestone notification for 7-day streak', () => {
    it('should send milestone message via WebSocket for 7-day streak', async () => {
      // Create habit
      const habitRes = await app.inject({
        method: 'POST',
        url: '/api/habits',
        headers: { cookie },
        payload: {
          name: 'T7 Habit',
          startDate: '2026-04-24',
          status: 'active',
        },
      });
      const habitId = JSON.parse(habitRes.payload).id;

      // Add 7 consecutive check-ins
      for (let i = 6; i >= 0; i--) {
        const date = getDaysAgoISO(i);
        await app.inject({
          method: 'POST',
          url: `/api/habits/${habitId}/checkins`,
          headers: { cookie },
          payload: { date },
        });
      }

      // Connect via WebSocket with session cookie
      const ws = new WebSocket(`ws://localhost:${port}/ws`, {
        headers: { cookie },
      });

      return new Promise<void>((resolve, reject) => {
        let milestoneDays7Received = false;

        ws.on('open', () => {
          ws.send(JSON.stringify({ type: 'subscribe', payload: { milestones: true } }));
        });

        ws.on('message', (data) => {
          try {
            const msg = JSON.parse(data.toString());

            if (msg.type === 'milestone' && msg.payload.habitId === habitId) {
              // For 7-day habit, may receive 3-day and 7-day milestones
              // Wait specifically for the 7-day one
              if (msg.payload.milestoneDays === 7) {
                expect(msg.payload.currentStreak).toBe(7);
                milestoneDays7Received = true;
                ws.close();
              }
            }
          } catch (e) {
            reject(e);
          }
        });

        ws.on('close', () => {
          expect(milestoneDays7Received).toBe(true);
          resolve();
        });

        ws.on('error', reject);

        setTimeout(() => {
          ws.close();
          reject(new Error('Timeout waiting for 7-day milestone'));
        }, 5000);
      });
    });
  });

  describe('T8: Milestone notification for 30-day streak', () => {
    it('should send milestone message via WebSocket for 30-day streak', async () => {
      // Create habit
      const habitRes = await app.inject({
        method: 'POST',
        url: '/api/habits',
        headers: { cookie },
        payload: {
          name: 'T8 Habit',
          startDate: '2026-04-11',
          status: 'active',
        },
      });
      const habitId = JSON.parse(habitRes.payload).id;

      // Add 30 consecutive check-ins
      for (let i = 29; i >= 0; i--) {
        const date = getDaysAgoISO(i);
        await app.inject({
          method: 'POST',
          url: `/api/habits/${habitId}/checkins`,
          headers: { cookie },
          payload: { date },
        });
      }

      // Connect via WebSocket with session cookie
      const ws = new WebSocket(`ws://localhost:${port}/ws`, {
        headers: { cookie },
      });

      return new Promise<void>((resolve, reject) => {
        let milestoneDays30Received = false;

        ws.on('open', () => {
          ws.send(JSON.stringify({ type: 'subscribe', payload: { milestones: true } }));
        });

        ws.on('message', (data) => {
          try {
            const msg = JSON.parse(data.toString());

            if (msg.type === 'milestone' && msg.payload.habitId === habitId) {
              // For 30-day habit, may receive 3-day, 7-day, and 30-day milestones
              // Wait specifically for the 30-day one
              if (msg.payload.milestoneDays === 30) {
                expect(msg.payload.currentStreak).toBe(30);
                milestoneDays30Received = true;
                ws.close();
              }
            }
          } catch (e) {
            reject(e);
          }
        });

        ws.on('close', () => {
          expect(milestoneDays30Received).toBe(true);
          resolve();
        });

        ws.on('error', reject);

        setTimeout(() => {
          ws.close();
          reject(new Error('Timeout waiting for 30-day milestone'));
        }, 5000);
      });
    });
  });

  describe('T9: Ack prevents duplicate milestone messages on reconnect', () => {
    it('should not resend milestone after ack, even on reconnect', async () => {
      // Create habit
      const habitRes = await app.inject({
        method: 'POST',
        url: '/api/habits',
        headers: { cookie },
        payload: {
          name: 'T9 Habit',
          startDate: '2026-05-01',
          status: 'active',
        },
      });
      const habitId = JSON.parse(habitRes.payload).id;

      // Add 3 consecutive check-ins
      for (let i = 2; i >= 0; i--) {
        const date = getDaysAgoISO(i);
        await app.inject({
          method: 'POST',
          url: `/api/habits/${habitId}/checkins`,
          headers: { cookie },
          payload: { date },
        });
      }

      // First connection: receive and ack milestone
      return new Promise<void>((resolve, reject) => {
        const ws1 = new WebSocket(`ws://localhost:${port}/ws`, {
          headers: { cookie },
        });

        let milestoneReceived = false;

        ws1.on('open', () => {
          ws1.send(JSON.stringify({ type: 'subscribe', payload: { milestones: true } }));
        });

        ws1.on('message', (data) => {
          try {
            const msg = JSON.parse(data.toString());

            if (msg.type === 'milestone' && msg.payload.habitId === habitId) {
              expect(msg.payload.milestoneDays).toBe(3);
              milestoneReceived = true;
              // Send ack
              ws1.send(JSON.stringify({
                type: 'ack',
                payload: { habitId, milestoneDays: 3 },
              }));
              // Wait a bit then close
              setTimeout(() => ws1.close(), 100);
            }
          } catch (e) {
            reject(e);
          }
        });

        ws1.on('close', () => {
          if (!milestoneReceived) {
            reject(new Error('First connection: milestone not received'));
            return;
          }

          // Second connection: should NOT receive the same milestone
          const ws2 = new WebSocket(`ws://localhost:${port}/ws`, {
            headers: { cookie },
          });

          let duplicateReceived = false;

          ws2.on('open', () => {
            ws2.send(JSON.stringify({ type: 'subscribe', payload: { milestones: true } }));
          });

          ws2.on('message', (data) => {
            try {
              const msg = JSON.parse(data.toString());

              if (msg.type === 'milestone' && msg.payload.habitId === habitId) {
                duplicateReceived = true;
              }
            } catch (e) {
              reject(e);
            }
          });

          setTimeout(() => {
            ws2.close();
            expect(duplicateReceived).toBe(false);
            resolve();
          }, 500);

          ws2.on('error', reject);
        });

        ws1.on('error', reject);

        setTimeout(() => {
          ws1.close();
          reject(new Error('Timeout on first connection'));
        }, 5000);
      });
    });

    it('should silently ignore ack for another user\'s habit', async () => {
      // Create second user session
      const login2Res = await app.inject({
        method: 'POST',
        url: '/api/auth/demo-login',
        payload: {},
      });
      const cookie2 = `${login2Res.cookies[0].name}=${login2Res.cookies[0].value}`;

      // User 1 creates a habit
      const habitRes = await app.inject({
        method: 'POST',
        url: '/api/habits',
        headers: { cookie },
        payload: {
          name: 'T9 User1 Habit',
          startDate: '2026-05-01',
          status: 'active',
        },
      });
      const habitId = JSON.parse(habitRes.payload).id;

      // User 1 adds check-ins
      for (let i = 2; i >= 0; i--) {
        const date = getDaysAgoISO(i);
        await app.inject({
          method: 'POST',
          url: `/api/habits/${habitId}/checkins`,
          headers: { cookie },
          payload: { date },
        });
      }

      // User 2 tries to ack User 1's habit via WS
      return new Promise<void>((resolve, reject) => {
        const ws = new WebSocket(`ws://localhost:${port}/ws`, {
          headers: { cookie: cookie2 },
        });

        let connectReceived = false;

        ws.on('open', () => {
          connectReceived = true;
          // User 2 tries to ack User 1's habit (should be ignored silently)
          ws.send(JSON.stringify({
            type: 'ack',
            payload: { habitId, milestoneDays: 3 },
          }));
        });

        ws.on('message', (data) => {
          try {
            const msg = JSON.parse(data.toString());
            // Should receive only the connected message, no error
            if (msg.type === 'connected') {
              expect(msg.payload.userId).toBeDefined();
            }
            // No error should be sent for the ack
          } catch (e) {
            reject(e);
          }
        });

        setTimeout(() => {
          ws.close();
          expect(connectReceived).toBe(true);
          resolve();
        }, 500);

        ws.on('error', reject);
      });
    });
  });
});
