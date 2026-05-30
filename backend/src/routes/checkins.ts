import { FastifyInstance } from 'fastify';
import { requireAuth } from '../middleware/requireAuth.js';

export default async function checkinsRoutes(fastify: FastifyInstance) {
  // Placeholder for checkins routes
  fastify.get('/:id/checkins', { onRequest: requireAuth }, async () => {
    return [];
  });
}
