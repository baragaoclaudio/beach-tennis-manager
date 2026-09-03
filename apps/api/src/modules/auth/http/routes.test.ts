import argon2 from 'argon2';
import { and, count, eq, inArray } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp } from '../../../app.js';
import { database, pool } from '../../../infrastructure/database/connection.js';
import { sessions, users } from '../../../infrastructure/database/schema.js';
import { hashSessionToken } from '../application/login-admin.js';

const adminEmail = `admin-test-${Date.now()}@example.com`;
const professorEmail = `professor-test-${Date.now()}@example.com`;
const password = 'admin-password';
const app = buildApp();

beforeAll(async () => {
  const passwordHash = await argon2.hash(password);

  await database.insert(users).values([
    { id: randomUUID(), email: adminEmail, passwordHash, role: 'ADMIN', updatedAt: new Date() },
    { id: randomUUID(), email: professorEmail, passwordHash, role: 'PROFESSOR', updatedAt: new Date() }
  ]);
});

afterAll(async () => {
  const testUsers = await database
    .select({ id: users.id })
    .from(users)
    .where(inArray(users.email, [adminEmail, professorEmail]));
  const userIds = testUsers.map((user) => user.id);

  await database.delete(sessions).where(inArray(sessions.userId, userIds));
  await database.delete(users).where(inArray(users.id, userIds));
  await app.close();
  await pool.end();
});

describe('admin authentication', () => {
  it('authenticates an admin and persists an HttpOnly session cookie', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/admin/login',
      payload: { email: adminEmail, password }
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).user).toMatchObject({
      email: adminEmail,
      role: 'ADMIN'
    });

    const setCookie = response.headers['set-cookie'];
    expect(setCookie).toBeDefined();
    const cookie = Array.isArray(setCookie) ? setCookie[0] : setCookie;
    expect(cookie).toContain('HttpOnly');

    const [adminUser] = await database
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, adminEmail));
    const [sessionCount] = await database
      .select({ count: count() })
      .from(sessions)
      .where(and(eq(sessions.userId, adminUser.id)));
    expect(Number(sessionCount.count)).toBe(1);
  });

  it('returns the authenticated admin from the HttpOnly session', async () => {
    const loginResponse = await app.inject({
      method: 'POST',
      url: '/auth/admin/login',
      payload: { email: adminEmail, password }
    });
    const setCookie = loginResponse.headers['set-cookie'];
    const cookie = Array.isArray(setCookie) ? setCookie[0] : setCookie;

    const response = await app.inject({
      method: 'GET',
      url: '/auth/me',
      headers: { cookie: cookie?.split(';')[0] ?? '' }
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).user).toMatchObject({
      email: adminEmail,
      role: 'ADMIN'
    });
  });

  it('rejects invalid credentials without creating a cookie', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/admin/login',
      payload: { email: adminEmail, password: 'wrong-password' }
    });

    expect(response.statusCode).toBe(401);
    expect(response.headers['set-cookie']).toBeUndefined();
  });

  it('rejects a professor at the administrator login', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/admin/login',
      payload: { email: professorEmail, password }
    });

    expect(response.statusCode).toBe(401);
  });

  it('rejects invalid login input', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/admin/login',
      payload: { email: 'invalid-email', password: '' }
    });

    expect(response.statusCode).toBe(400);
  });

  it('rejects /auth/me without a session cookie', async () => {
    const response = await app.inject({ method: 'GET', url: '/auth/me' });

    expect(response.statusCode).toBe(401);
  });

  it('logs out an authenticated admin and invalidates the session', async () => {
    const loginResponse = await app.inject({
      method: 'POST',
      url: '/auth/admin/login',
      payload: { email: adminEmail, password }
    });
    const setCookie = loginResponse.headers['set-cookie'];
    const cookie = Array.isArray(setCookie) ? setCookie[0] : setCookie;
    const token = cookie?.split(';')[0].split('=')[1] ?? '';

    const logoutResponse = await app.inject({
      method: 'POST',
      url: '/auth/logout',
      headers: { cookie: cookie?.split(';')[0] ?? '' }
    });

    expect(logoutResponse.statusCode).toBe(204);
    expect(logoutResponse.headers['set-cookie']).toContain('Expires=Thu, 01 Jan 1970');

    const remainingSessions = await database
      .select({ id: sessions.id })
      .from(sessions)
      .where(eq(sessions.tokenHash, hashSessionToken(token)));
    expect(remainingSessions).toHaveLength(0);

    const meResponse = await app.inject({
      method: 'GET',
      url: '/auth/me',
      headers: { cookie: cookie?.split(';')[0] ?? '' }
    });
    expect(meResponse.statusCode).toBe(401);
  });

  it('treats logout without a session as idempotent', async () => {
    const response = await app.inject({ method: 'POST', url: '/auth/logout' });

    expect(response.statusCode).toBe(204);
    expect(response.headers['set-cookie']).toContain('Expires=Thu, 01 Jan 1970');
  });
});