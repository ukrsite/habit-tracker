import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import passport from 'passport';
import * as schema from '../db/schema.js';
import { randomUUID, randomBytes } from 'crypto';
import { eq } from 'drizzle-orm';

// Adapter to make FastifyReply compatible with Express response
function adaptReplyForPassport(reply: FastifyReply) {
  const adaptedReply = reply as any;

  adaptedReply.setHeader = (name: string, value: string | string[]) => {
    reply.header(name, value);
    return adaptedReply;
  };

  adaptedReply.end = (data?: any) => {
    if (data) reply.send(data);
    return adaptedReply;
  };

  adaptedReply.redirect = (url: string) => {
    reply.redirect(url);
    return adaptedReply;
  };

  return adaptedReply;
}

export default async function authRoutes(fastify: FastifyInstance, db: any) {
  // DEMO: POST /auth/demo-login - Test login without OAuth (for development only)
  fastify.post('/demo-login', async (request: FastifyRequest, reply: FastifyReply) => {
    // Gate demo-login to non-production environments only
    if (process.env.NODE_ENV === 'production') {
      return reply.status(404).send({ error: 'Not found' });
    }

    try {
      // Support multiple test users via optional query parameter
      const { testUser } = request.query as { testUser?: string };
      const providerUserId = testUser ? `demo-${testUser}` : 'demo-user';

      // Get or create demo user
      let user = await db.query.users.findFirst({
        where: eq(schema.users.providerUserId, providerUserId),
      });

      if (!user) {
        const userId = randomUUID();
        const now = Math.floor(Date.now() / 1000);
        const displayName = testUser ? `Demo User ${testUser}` : 'Demo User';
        await db.insert(schema.users).values({
          id: userId,
          provider: 'demo',
          providerUserId,
          email: testUser ? `demo-${testUser}@example.com` : 'demo@example.com',
          displayName,
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
  fastify.get('/google', (request: FastifyRequest, reply: FastifyReply) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return reply.status(500).send({ error: 'Google OAuth not configured' });
    }
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    const redirectUri = encodeURIComponent(`${backendUrl}/api/auth/google/callback`);
    const scope = encodeURIComponent('openid email profile');
    const state = randomBytes(16).toString('hex');
    (request.session as any).oauthState = state;
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
    return reply.redirect(url);
  });

  // GET /auth/google/callback
  fastify.get('/google/callback', async (request: FastifyRequest, reply: FastifyReply) => {
    const code = (request.query as any).code;
    const error = (request.query as any).error;
    const state = (request.query as any).state;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    if (error) {
      return reply.redirect(frontendUrl + '/login?error=google_auth_failed');
    }

    if (!code) {
      return reply.status(400).send({ error: 'Missing authorization code' });
    }

    if (!state || state !== (request.session as any).oauthState) {
      console.error('[Google callback] State mismatch or missing');
      return reply.redirect(frontendUrl + '/login?error=google_auth_failed');
    }
    delete (request.session as any).oauthState;

    try {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        throw new Error('Google OAuth not configured');
      }

      // Exchange code for token
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: `${backendUrl}/api/auth/google/callback`,
        }),
      });

      const tokenData = (await tokenResponse.json()) as any;
      if (!tokenData.access_token) {
        throw new Error('Failed to get access token');
      }

      // Get user profile
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });

      const profile = (await userResponse.json()) as any;

      // Find or create user
      let user = await db.query.users.findFirst({
        where: eq(schema.users.providerUserId, profile.id),
      });

      if (!user) {
        const userId = randomUUID();
        const now = Math.floor(Date.now() / 1000);
        await db.insert(schema.users).values({
          id: userId,
          provider: 'google',
          providerUserId: profile.id,
          email: profile.email,
          displayName: profile.name,
          avatarUrl: profile.picture,
          createdAt: now,
        });
        user = await db.query.users.findFirst({
          where: eq(schema.users.id, userId),
        });
      }

      // Set session and redirect
      request.session.userId = user?.id;
      await request.session.save();
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return reply.redirect(frontendUrl + '/');
    } catch (error) {
      console.error('[Google callback] Error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return reply.redirect(frontendUrl + '/login?error=google_auth_failed');
    }
  });

  // GET /auth/github
  fastify.get('/github', (request: FastifyRequest, reply: FastifyReply) => {
    const clientId = process.env.GITHUB_CLIENT_ID;
    if (!clientId) {
      return reply.status(500).send({ error: 'GitHub OAuth not configured' });
    }
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    const redirectUri = encodeURIComponent(`${backendUrl}/api/auth/github/callback`);
    const scope = encodeURIComponent('user:email');
    const state = randomBytes(16).toString('hex');
    (request.session as any).oauthState = state;
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    return reply.redirect(url);
  });

  // GET /auth/github/callback
  fastify.get('/github/callback', async (request: FastifyRequest, reply: FastifyReply) => {
    const code = (request.query as any).code;
    const error = (request.query as any).error;
    const state = (request.query as any).state;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    if (error) {
      return reply.redirect(frontendUrl + '/login?error=github_auth_failed');
    }

    if (!state || state !== (request.session as any).oauthState) {
      console.error('[GitHub callback] State mismatch or missing');
      return reply.redirect(frontendUrl + '/login?error=github_auth_failed');
    }
    delete (request.session as any).oauthState;

    if (!code) {
      return reply.status(400).send({ error: 'Missing authorization code' });
    }

    try {
      const clientId = process.env.GITHUB_CLIENT_ID;
      const clientSecret = process.env.GITHUB_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        throw new Error('GitHub OAuth not configured');
      }

      const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      });

      const tokenData = (await tokenResponse.json()) as any;
      if (!tokenData.access_token) {
        throw new Error('Failed to get access token: ' + (tokenData.error || 'unknown'));
      }

      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Accept': 'application/json',
        },
      });

      const profile = (await userResponse.json()) as any;

      // Get user emails if not in profile
      let email = profile.email;
      if (!email) {
        const emailResponse = await fetch('https://api.github.com/user/emails', {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
            'Accept': 'application/json',
          },
        });
        const emails = (await emailResponse.json()) as any;
        const primaryEmail = emails.find((e: any) => e.primary);
        email = primaryEmail?.email || emails[0]?.email;
      }

      // Find or create user
      let user = await db.query.users.findFirst({
        where: eq(schema.users.providerUserId, profile.id.toString()),
      });

      if (!user) {
        const userId = randomUUID();
        const now = Math.floor(Date.now() / 1000);
        await db.insert(schema.users).values({
          id: userId,
          provider: 'github',
          providerUserId: profile.id.toString(),
          email,
          displayName: profile.name || profile.login || 'User',
          avatarUrl: profile.avatar_url,
          createdAt: now,
        });
        user = await db.query.users.findFirst({
          where: eq(schema.users.id, userId),
        });
      }

      // Set session and redirect
      request.session.userId = user?.id;
      await request.session.save();
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return reply.redirect(frontendUrl + '/');
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return reply.redirect(frontendUrl + '/login?error=github_auth_failed');
    }
  });

  // POST /auth/logout
  fastify.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    request.session.destroy((err?: Error) => {
      if (err) {
        return reply.status(500).send({ error: 'Failed to logout' });
      }
      return reply.status(204).send();
    });
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
      return reply.status(401).send({ error: 'User not found' });
    }

    return reply.send(user);
  });
}
