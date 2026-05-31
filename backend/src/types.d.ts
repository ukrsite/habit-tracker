import 'fastify';
import '@fastify/session';
import '@fastify/websocket';

declare module '@fastify/session' {
  interface Session {
    userId?: string;
    save(callback?: (err?: Error) => void): void;
    destroy(callback?: (err?: Error) => void): void;
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    session: import('@fastify/session').Session;
  }
}

declare module 'passport-github2' {
  export function Strategy(options: any, verify: any): any;
}
