import Fastify from 'fastify';
import fastifySession from '@fastify/session';
import fastifyWebsocket from '@fastify/websocket';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import SQLiteStore from 'connect-sqlite3';
import { eq } from 'drizzle-orm';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './db/schema.js';
import { randomUUID } from 'crypto';
import authRoutes from './routes/auth.js';
import habitsRoutes from './routes/habits.js';
import checkinsRoutes from './routes/checkins.js';
import wsHandler from './ws/handler.js';

export const db = drizzle(
  new Database(process.env.DATABASE_PATH || './data/habits.db'),
  { schema }
);

export async function createApp() {
  const app = Fastify();

  const store = new SQLiteStore({
    db: process.env.DATABASE_PATH || './data/habits.db',
    dir: './data',
    table: 'sessions',
  });

  // Register session plugin
  await app.register(fastifySession, {
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    store,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  });

  // Initialize Passport
  await app.register(async (fastify) => {
    fastify.use(passport.initialize());
    fastify.use(passport.session());
  });

  // Passport serialization
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, id),
      });
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await db.query.users.findFirst({
            where: eq(schema.users.provider, 'google'),
          });

          if (user) {
            return done(null, user);
          }

          const newUser = {
            id: randomUUID(),
            provider: 'google',
            providerUserId: profile.id,
            email: profile.emails?.[0]?.value,
            displayName: profile.displayName,
            avatarUrl: profile.photos?.[0]?.value,
            createdAt: Math.floor(Date.now() / 1000),
          };

          await db.insert(schema.users).values(newUser);
          done(null, newUser);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  // GitHub OAuth Strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        callbackURL: '/api/auth/github/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await db.query.users.findFirst({
            where: eq(schema.users.provider, 'github'),
          });

          if (user) {
            return done(null, user);
          }

          const newUser = {
            id: randomUUID(),
            provider: 'github',
            providerUserId: profile.id.toString(),
            email: profile.emails?.[0]?.value,
            displayName: profile.displayName || profile.username || 'User',
            avatarUrl: profile.photos?.[0]?.value,
            createdAt: Math.floor(Date.now() / 1000),
          };

          await db.insert(schema.users).values(newUser);
          done(null, newUser);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  // Register WebSocket plugin
  await app.register(fastifyWebsocket);

  // Register routes
  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(habitsRoutes, { prefix: '/api/habits' });
  await app.register(checkinsRoutes, { prefix: '/api/habits' });

  // WebSocket route
  app.get('/ws', { websocket: true }, wsHandler);

  return app;
}

// Start server if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const app = await createApp();
  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen({ port, host: '0.0.0.0' });
  console.log(`Server running on http://localhost:${port}`);
}
