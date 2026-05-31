import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import passport from 'passport';
import * as schema from '../db/schema.js';
import { randomUUID } from 'crypto';
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
  fastify.get('/google', (request: FastifyRequest, reply: FastifyReply) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return reply.status(500).send({ error: 'Google OAuth not configured' });
    }
    const redirectUri = encodeURIComponent('http://localhost:3000/api/auth/google/callback');
    const scope = encodeURIComponent('openid email profile');
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    return reply.redirect(url);
  });

  // GET /auth/google/callback
  fastify.get('/google/callback', async (request: FastifyRequest, reply: FastifyReply) => {
    const code = (request.query as any).code;
    const error = (request.query as any).error;

    if (error) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return reply.redirect(frontendUrl + '/login');
    }

    if (!code) {
      return reply.status(400).send({ error: 'Missing authorization code' });
    }

    try {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        throw new Error('Google OAuth not configured');
      }

      // Exchange code for token
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
          redirect_uri: 'http://localhost:3000/api/auth/google/callback',
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
    const redirectUri = encodeURIComponent('http://localhost:3000/api/auth/github/callback');
    const scope = encodeURIComponent('user:email');
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    return reply.redirect(url);
  });

  // GET /auth/github/callback
  fastify.get('/github/callback', async (request: FastifyRequest, reply: FastifyReply) => {
    const code = (request.query as any).code;
    const error = (request.query as any).error;

    console.log('[GitHub callback] Query:', { code: code ? 'present' : 'missing', error });

    if (error) {
      console.log('[GitHub callback] Error from GitHub:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return reply.redirect(frontendUrl + '/login');
    }

    if (!code) {
      console.log('[GitHub callback] No code provided');
      return reply.status(400).send({ error: 'Missing authorization code' });
    }

    try {
      const clientId = process.env.GITHUB_CLIENT_ID;
      const clientSecret = process.env.GITHUB_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        throw new Error('GitHub OAuth not configured');
      }

      console.log('[GitHub callback] Exchanging code for token...');
      // Exchange code for token
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
      console.log('[GitHub callback] Token response:', { has_access_token: !!tokenData.access_token, error: tokenData.error });
      if (!tokenData.access_token) {
        throw new Error('Failed to get access token: ' + (tokenData.error || 'unknown'));
      }

      // Get user profile
      console.log('[GitHub callback] Fetching user profile...');
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Accept': 'application/json',
        },
      });

      const profile = (await userResponse.json()) as any;
      console.log('[GitHub callback] Profile received:', { id: profile.id, login: profile.login });

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
      console.log('[GitHub callback] User found/created:', user?.id);
      request.session.userId = user?.id;
      await request.session.save();
      console.log('[GitHub callback] Session saved, redirecting to frontend');
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return reply.redirect(frontendUrl + '/');
    } catch (error) {
      console.error('[GitHub callback] Error:', error instanceof Error ? error.message : String(error));
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
      return reply.status(401).send({ error: 'User not found' });
    }

    return reply.send(user);
  });
}
