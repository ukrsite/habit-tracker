import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import passport from 'passport';
import * as schema from '../db/schema.js';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';

export default async function authRoutes(fastify: FastifyInstance, db: any) {
  // DEMO: POST /auth/demo-login - Test login without OAuth (for development)
  fastify.post('/demo-login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Get or create demo user
      let user = await db.query.users.findFirst({
        where: eq(schema.users.providerUserId, 'demo-user'),
      });

      if (!user) {
        const userId = randomUUID();
        const now = Math.floor(Date.now() / 1000);
        await db.insert(schema.users).values({
          id: userId,
          provider: 'demo',
          providerUserId: 'demo-user',
          email: 'demo@example.com',
          displayName: 'Demo User',
          avatarUrl: 'https://i.pravatar.cc/150?img=1',
          createdAt: now,
        });
        user = await db.query.users.findFirst({
          where: eq(schema.users.id, userId),
        });
      }

      // Set session
      request.session.userId = user?.id;
      await request.session.save();
      return reply.status(200).send({ message: 'Demo login successful', userId: user?.id });
    } catch (error) {
      return reply.status(500).send({ error: 'Demo login failed' });
    }
  });

  // GET /auth/google
  fastify.get(
    '/google',
    { onRequest: passport.authenticate('google', { scope: ['profile', 'email'] }) },
    (request: FastifyRequest, reply: FastifyReply) => {
      // This handler is never called because the middleware redirects
    }
  );

  // GET /auth/google/callback
  fastify.get(
    '/google/callback',
    { onRequest: passport.authenticate('google', { failureRedirect: '/login' }) },
    async (request: FastifyRequest, reply: FastifyReply) => {
      request.session.userId = (request.user as any).id;
      await request.session.save();
      return reply.redirect('/');
    }
  );

  // GET /auth/github
  fastify.get(
    '/github',
    { onRequest: passport.authenticate('github', { scope: ['user:email'] }) },
    (request: FastifyRequest, reply: FastifyReply) => {
      // This handler is never called because the middleware redirects
    }
  );

  // GET /auth/github/callback
  fastify.get(
    '/github/callback',
    { onRequest: passport.authenticate('github', { failureRedirect: '/login' }) },
    async (request: FastifyRequest, reply: FastifyReply) => {
      request.session.userId = (request.user as any).id;
      await request.session.save();
      return reply.redirect('/');
    }
  );

  // POST /auth/logout
  fastify.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    request.session.destroy((err) => {
      if (err) {
        return reply.status(500).send({ error: 'Failed to logout' });
      }
    });
    return reply.status(204).send();
  });

  // GET /auth/me
  fastify.get('/me', async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.session.userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    // Get user from database using session userId
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, request.session.userId),
    });

    if (!user) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    return reply.send(user);
  });
}
