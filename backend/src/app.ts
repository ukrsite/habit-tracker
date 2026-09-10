import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import fastifyWebsocket from '@fastify/websocket';
import ConnectSqlite3Session from 'connect-sqlite3';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './db/schema.js';
import { runMigrations } from './db/migrate.js';
import authRoutes from './routes/auth.js';
import habitsRoutes from './routes/habits.js';
import checkinsRoutes from './routes/checkins.js';
import wsHandler from './ws/handler.js';
import { requireAuth } from './middleware/requireAuth.js';

const dbPath = process.env.DATABASE_PATH || './data/habits.db';
runMigrations(dbPath);
export const db = drizzle(
  new Database(dbPath, { readonly: false }),
  { schema }
);

export async function createApp() {
  const app = Fastify();

  // Register CORS for frontend development
  await app.register(fastifyCors as any, {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Register cookie plugin (required by session)
  await app.register(fastifyCookie as any);

  // Register session plugin - require SESSION_SECRET in all environments
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    throw new Error('SESSION_SECRET must be set to a string of at least 32 characters in the .env file');
  }

  const secret = process.env.SESSION_SECRET;

  // For development, use in-memory store to avoid SQLite permission issues
  // Production deployments should use persistent SQLite store
  const sessionStore = process.env.NODE_ENV === 'production'
    ? new (ConnectSqlite3Session(fastifySession as any))({
        dir: path.resolve(__dirname, '../../data'),
        db: 'sessions.db',
      })
    : undefined; // undefined = memory store (default)

  await app.register(fastifySession as any, {
    secret,
    ...(sessionStore && { store: sessionStore }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  } as any);

  // Register WebSocket plugin
  await app.register(fastifyWebsocket as any);

  // Register routes with db instance
  await app.register((fastify) => authRoutes(fastify, db), { prefix: '/api/auth' });
  await app.register((fastify) => habitsRoutes(fastify, db), { prefix: '/api/habits' });
  await app.register((fastify) => checkinsRoutes(fastify, db), { prefix: '/api/habits' });

  // WebSocket route - require auth at upgrade time via preValidation
  app.get('/ws', { websocket: true, preValidation: requireAuth } as any, wsHandler as any);

  return app;
}

// Start server if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const app = await createApp();
  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen({ port, host: '0.0.0.0' });
  console.log(`Server running on http://localhost:${port}`);
}
