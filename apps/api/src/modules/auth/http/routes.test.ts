import argon2 from 'argon2';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp } from '../../../app.js';
import { prisma } from '../../../infrastructure/database/prisma-client.js';

const adminEmail = `admin-test-${Date.now()}@example.com`;
const professorEmail = `professor-test-${Date.now()}@example.com`;
const password = 'admin-password';
const app = buildApp();

beforeAll(async () => {
  const passwordHash = await argon2.hash(password);

  await prisma.user.createMany({
    data: [
      { email: adminEmail, passwordHash, role: 'ADMIN' },
      { email: professorEmail, passwordHash, role: 'PROFESSOR' }
    ]
  });
});

afterAll(async () => {
  const users = await prisma.user.findMany({
    where: { email: { in: [adminEmail, professorEmail] } },
    select: { id: true }
  });

  await prisma.session.deleteMany({
    where: { userId: { in: users.map((user) => user.id) } }
  });
  await prisma.user.deleteMany({
    where: { id: { in: users.map((user) => user.id) } }
  });
  await app.close();
  await prisma.$disconnect();
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

    const sessionCount = await prisma.session.count({
      where: { userId: (await prisma.user.findUniqueOrThrow({ where: { email: adminEmail } })).id }
    });
    expect(sessionCount).toBe(1);
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
});