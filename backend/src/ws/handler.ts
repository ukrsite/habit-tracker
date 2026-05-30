import { FastifyRequest, SocketStream } from 'fastify';

export default async function wsHandler(socket: SocketStream, request: FastifyRequest) {
  // Placeholder for WebSocket handler
  socket.socket.send(JSON.stringify({ type: 'connected', payload: { userId: (request.user as any)?.id } }));
}
