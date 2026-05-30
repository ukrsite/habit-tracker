import { FastifyRequest, FastifyReply } from 'fastify';

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  if (!request.session.userId) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
}
