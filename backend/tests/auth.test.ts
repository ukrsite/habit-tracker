import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createApp } from '../src/app.js';

describe('Authentication (T1) - HTTP Level', () => {
  let app: any;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('T1: Demo login creates session and /auth/me returns profile', async () => {
    // POST to demo-login endpoint
    const loginRes = await app.inject({
      method: 'POST',
      url: '/api/auth/demo-login',
      payload: {},
    });

    expect(loginRes.statusCode).toBe(200);
    const loginData = JSON.parse(loginRes.payload);
    expect(loginData.userId).toBeDefined();
    const userId = loginData.userId;

    // Extract cookies from response
    const cookies = loginRes.cookies;
    const sessionCookie = cookies.find((c: any) => c.name === 'sessionId');
    expect(sessionCookie).toBeDefined();

    // Now call /auth/me with the session cookie
    const meRes = await app.inject({
      method: 'GET',
      url: '/api/auth/me',
      headers: {
        cookie: `${sessionCookie.name}=${sessionCookie.value}`,
      },
    });

    expect(meRes.statusCode).toBe(200);
    const userData = JSON.parse(meRes.payload);
    expect(userData.id).toBe(userId);
    expect(userData.provider).toBe('demo');
    expect(userData.displayName).toBeDefined();
    expect(userData.email).toBeDefined();
    expect(userData.avatarUrl).toBeDefined();
  });

  it('T1: GET /auth/me without session returns 401', async () => {
    const meRes = await app.inject({
      method: 'GET',
      url: '/api/auth/me',
    });

    expect(meRes.statusCode).toBe(401);
    const data = JSON.parse(meRes.payload);
    expect(data.error).toBe('Unauthorized');
  });

  it('T1: Logout destroys session (204 response)', async () => {
    // Login first
    const loginRes = await app.inject({
      method: 'POST',
      url: '/api/auth/demo-login',
      payload: {},
    });
    const sessionCookie = loginRes.cookies.find((c: any) => c.name === 'sessionId');

    // Verify session is valid
    const beforeLogoutRes = await app.inject({
      method: 'GET',
      url: '/api/auth/me',
      headers: {
        cookie: `${sessionCookie.name}=${sessionCookie.value}`,
      },
    });
    expect(beforeLogoutRes.statusCode).toBe(200);

    // Now logout
    const logoutRes = await app.inject({
      method: 'POST',
      url: '/api/auth/logout',
      headers: {
        cookie: `${sessionCookie.name}=${sessionCookie.value}`,
      },
    });

    expect(logoutRes.statusCode).toBe(204);

    // After logout, session should be invalid
    const afterLogoutRes = await app.inject({
      method: 'GET',
      url: '/api/auth/me',
      headers: {
        cookie: `${sessionCookie.name}=${sessionCookie.value}`,
      },
    });
    expect(afterLogoutRes.statusCode).toBe(401);
  });
});
