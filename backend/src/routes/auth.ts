import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import passport from 'passport';

export default async function authRoutes(fastify: FastifyInstance) {
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
    return reply.send(request.user);
  });
}
