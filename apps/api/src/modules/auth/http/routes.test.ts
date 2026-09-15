import argon2 from 'argon2';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createJwtAccessTokenService } from '../../../infrastructure/auth/jwt-access-token.js';
import { database, pool } from '../../../infrastructure/database/connection.js';
import { refreshTokens, users } from '../../../infrastructure/database/schema.js';
import { hashSessionToken, REFRESH_TOKEN_TTL_SECONDS } from '../application/login-admin.js';
import { hashOpaqueToken } from '../application/opaque-token-digest.js';
import { opaqueRefreshTokenGenerator } from '../../../infrastructure/auth/opaque-refresh-token.js';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  SESSION_COOKIE_NAME
} from './auth-cookies.js';

process.env.JWT_SECRET ??= 'development-jwt-secret-key-32-chars';

const { buildApp } = await import('../../../app.js');

const adminEmail = `admin-test-${Date.now()}@example.com`;
const professorEmail = `professor-test-${Date.now()}@example.com`;
const password = 'admin-password';
const jwtSecret = process.env.JWT_SECRET;
const app = buildApp();

function setCookieHeaders(response: { headers: { 'set-cookie'?: string | string[] } }): string[] {
  const header = response.headers['set-cookie'];

  if (!header) {
    return [];
  }

  return Array.isArray(header) ? header : [header];
}

function cookieValue(headers: string[], name: string): string | undefined {
  const line = headers.find((header) => header.startsWith(`${name}=`));
  return line?.split(';')[0].slice(name.length + 1);
}

function cookieLine(headers: string[], name: string): string | undefined {
  return headers.find((header) => header.startsWith(`${name}=`));
}

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

  await database.delete(refreshTokens).where(inArray(refreshTokens.userId, userIds));
  await database.delete(users).where(inArray(users.id, userIds));
  await app.close();
  await pool.end();
});

describe('admin authentication', () => {
  it('issues HttpOnly access and refresh cookies without putting tokens in the body', async () => {
    const beforeLogin = new Date();
    const response = await app.inject({
      method: 'POST',
      url: '/auth/admin/login',
      payload: { email: adminEmail, password }
    });
    const body = JSON.parse(response.body);
    const cookies = setCookieHeaders(response);
    const accessToken = cookieValue(cookies, ACCESS_TOKEN_COOKIE_NAME);
    const refreshToken = cookieValue(cookies, REFRESH_TOKEN_COOKIE_NAME);
    const accessCookie = cookieLine(cookies, ACCESS_TOKEN_COOKIE_NAME);
    const refreshCookie = cookieLine(cookies, REFRESH_TOKEN_COOKIE_NAME);

    expect(response.statusCode).toBe(200);
    expect(body.user).toMatchObject({
      email: adminEmail,
      role: 'ADMIN'
    });
    expect(body).not.toHaveProperty('accessToken');
    expect(body).not.toHaveProperty('refreshToken');
    expect(body).not.toHaveProperty('token');
    expect(JSON.stringify(body)).not.toContain(accessToken);
    expect(JSON.stringify(body)).not.toContain(refreshToken);
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    expect(accessToken?.split('.')).toHaveLength(3);
    expect(accessCookie).toContain('HttpOnly');
    expect(refreshCookie).toContain('HttpOnly');
    expect(accessCookie).toMatch(/Max-Age=600/i);
    expect(refreshCookie).toMatch(/Max-Age=28800/i);

    const [adminUser] = await database
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, adminEmail));
    const [stored] = await database
      .select()
      .from(refreshTokens)
      .where(and(eq(refreshTokens.userId, adminUser.id)))
      .orderBy(desc(refreshTokens.createdAt))
      .limit(1);
    const refreshHash = hashSessionToken(refreshToken ?? '');

    expect(stored.tokenHash).toBe(refreshHash);
    expect(stored.tokenHash).not.toBe(refreshToken);
    expect(stored.tokenHash).not.toBe(accessToken);
    expect(stored.familyId).toEqual(expect.any(String));
    expect(stored.familyId.length).toBeGreaterThan(0);
    expect(stored.replacedById).toBeNull();
    expect(stored.revokedAt).toBeNull();
    expect(
      Math.abs(stored.expiresAt.getTime() - (beforeLogin.getTime() + REFRESH_TOKEN_TTL_SECONDS * 1000))
    ).toBeLessThan(10_000);
  });

  it('returns the authenticated admin from a valid access token cookie', async () => {
    const loginResponse = await app.inject({
      method: 'POST',
      url: '/auth/admin/login',
      payload: { email: adminEmail, password }
    });
    const accessToken = cookieValue(setCookieHeaders(loginResponse), ACCESS_TOKEN_COOKIE_NAME);

    const response = await app.inject({
      method: 'GET',
      url: '/auth/me',
      headers: { cookie: `${ACCESS_TOKEN_COOKIE_NAME}=${accessToken}` }
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).user).toMatchObject({
      email: adminEmail,
      role: 'ADMIN'
    });
  });

  it('rejects /auth/me with an invalid access token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/auth/me',
      headers: { cookie: `${ACCESS_TOKEN_COOKIE_NAME}=not-a-jwt` }
    });

    expect(response.statusCode).toBe(401);
  });

  it('rejects /auth/me with an expired access token', async () => {
    const [adminUser] = await database
      .select({ id: users.id, email: users.email, role: users.role })
      .from(users)
      .where(eq(users.email, adminEmail));
    const expiredToken = await createJwtAccessTokenService({ secret: jwtSecret }).issue(
      { sub: adminUser.id, email: adminUser.email, role: adminUser.role },
      new Date(Date.now() - 11 * 60 * 1000)
    );

    const response = await app.inject({
      method: 'GET',
      url: '/auth/me',
      headers: { cookie: `${ACCESS_TOKEN_COOKIE_NAME}=${expiredToken}` }
    });

    expect(response.statusCode).toBe(401);
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

  it('rejects /auth/me without an access token cookie', async () => {
    const response = await app.inject({ method: 'GET', url: '/auth/me' });

    expect(response.statusCode).toBe(401);
  });

  it('keeps the previous session-cookie logout path', async () => {
    const loginResponse = await app.inject({
      method: 'POST',
      url: '/auth/admin/login',
      payload: { email: adminEmail, password }
    });
    const refreshToken = cookieValue(setCookieHeaders(loginResponse), REFRESH_TOKEN_COOKIE_NAME);

    const logoutResponse = await app.inject({
      method: 'POST',
      url: '/auth/logout',
      headers: { cookie: `${SESSION_COOKIE_NAME}=${refreshToken}` }
    });

    expect(logoutResponse.statusCode).toBe(204);
    expect(cookieLine(setCookieHeaders(logoutResponse), SESSION_COOKIE_NAME)).toContain('Expires=Thu, 01 Jan 1970');

    const remaining = await database
      .select({ id: refreshTokens.id })
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, hashSessionToken(refreshToken ?? '')));
    expect(remaining).toHaveLength(0);
  });

  it('treats logout without a session as idempotent', async () => {
    const response = await app.inject({ method: 'POST', url: '/auth/logout' });

    expect(response.statusCode).toBe(204);
    expect(cookieLine(setCookieHeaders(response), SESSION_COOKIE_NAME)).toContain('Expires=Thu, 01 Jan 1970');
  });
});

describe('POST /auth/refresh', () => {
  async function login() {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/admin/login',
      payload: { email: adminEmail, password }
    });
    const cookies = setCookieHeaders(response);

    return {
      response,
      accessToken: cookieValue(cookies, ACCESS_TOKEN_COOKIE_NAME) ?? '',
      refreshToken: cookieValue(cookies, REFRESH_TOKEN_COOKIE_NAME) ?? ''
    };
  }

  async function adminId() {
    const [adminUser] = await database
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, adminEmail));
    return adminUser.id;
  }

  it('rejects refresh without a cookie', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/refresh'
    });

    expect(response.statusCode).toBe(401);
    expect(response.headers['set-cookie']).toBeUndefined();
  });

  it('rejects a refresh token that does not exist', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/refresh',
      headers: { cookie: `${REFRESH_TOKEN_COOKIE_NAME}=${opaqueRefreshTokenGenerator.generate()}` }
    });

    expect(response.statusCode).toBe(401);
    expect(response.headers['set-cookie']).toBeUndefined();
  });

  it('rotates a valid refresh token into new HttpOnly cookies without tokens in the body', async () => {
    const { refreshToken } = await login();
    const response = await app.inject({
      method: 'POST',
      url: '/auth/refresh',
      headers: { cookie: `${REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}` }
    });
    const body = JSON.parse(response.body);
    const cookies = setCookieHeaders(response);
    const nextAccess = cookieValue(cookies, ACCESS_TOKEN_COOKIE_NAME);
    const nextRefresh = cookieValue(cookies, REFRESH_TOKEN_COOKIE_NAME);

    expect(response.statusCode).toBe(200);
    expect(body.user).toMatchObject({
      email: adminEmail,
      role: 'ADMIN'
    });
    expect(body).not.toHaveProperty('accessToken');
    expect(body).not.toHaveProperty('refreshToken');
    expect(body).not.toHaveProperty('token');
    expect(JSON.stringify(body)).not.toContain(nextAccess);
    expect(JSON.stringify(body)).not.toContain(nextRefresh);
    expect(nextAccess).toBeDefined();
    expect(nextRefresh).toBeDefined();
    expect(nextAccess?.split('.')).toHaveLength(3);
    expect(nextRefresh).not.toBe(refreshToken);
    expect(cookieLine(cookies, ACCESS_TOKEN_COOKIE_NAME)).toContain('HttpOnly');
    expect(cookieLine(cookies, REFRESH_TOKEN_COOKIE_NAME)).toContain('HttpOnly');
  });

  it('rejects the previous refresh token after rotation', async () => {
    const { refreshToken } = await login();
    await app.inject({
      method: 'POST',
      url: '/auth/refresh',
      headers: { cookie: `${REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}` }
    });

    const reuse = await app.inject({
      method: 'POST',
      url: '/auth/refresh',
      headers: { cookie: `${REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}` }
    });

    expect(reuse.statusCode).toBe(409);
    expect(reuse.headers['set-cookie']).toBeUndefined();
  });

  it('rejects an expired refresh token', async () => {
    const token = opaqueRefreshTokenGenerator.generate();
    await database.insert(refreshTokens).values({
      id: randomUUID(),
      userId: await adminId(),
      tokenHash: hashOpaqueToken(token),
      familyId: randomUUID(),
      expiresAt: new Date(Date.now() - 1000)
    });

    const response = await app.inject({
      method: 'POST',
      url: '/auth/refresh',
      headers: { cookie: `${REFRESH_TOKEN_COOKIE_NAME}=${token}` }
    });

    expect(response.statusCode).toBe(401);
    expect(response.headers['set-cookie']).toBeUndefined();
  });

  it('rejects a revoked refresh token', async () => {
    const token = opaqueRefreshTokenGenerator.generate();
    await database.insert(refreshTokens).values({
      id: randomUUID(),
      userId: await adminId(),
      tokenHash: hashOpaqueToken(token),
      familyId: randomUUID(),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
      revokedAt: new Date()
    });

    const response = await app.inject({
      method: 'POST',
      url: '/auth/refresh',
      headers: { cookie: `${REFRESH_TOKEN_COOKIE_NAME}=${token}` }
    });

    expect(response.statusCode).toBe(401);
    expect(response.headers['set-cookie']).toBeUndefined();
  });

  it('does not issue new tokens on reuse and revokes the rest of the family', async () => {
    const first = await login();
    const rotated = await app.inject({
      method: 'POST',
      url: '/auth/refresh',
      headers: { cookie: `${REFRESH_TOKEN_COOKIE_NAME}=${first.refreshToken}` }
    });
    const familyRefresh = cookieValue(setCookieHeaders(rotated), REFRESH_TOKEN_COOKIE_NAME);

    const reuse = await app.inject({
      method: 'POST',
      url: '/auth/refresh',
      headers: { cookie: `${REFRESH_TOKEN_COOKIE_NAME}=${first.refreshToken}` }
    });

    expect(reuse.statusCode).toBe(409);
    expect(reuse.headers['set-cookie']).toBeUndefined();
    expect(JSON.parse(reuse.body)).not.toHaveProperty('user');

    const familyAfterReuse = await app.inject({
      method: 'POST',
      url: '/auth/refresh',
      headers: { cookie: `${REFRESH_TOKEN_COOKIE_NAME}=${familyRefresh}` }
    });

    expect(familyAfterReuse.statusCode).toBe(401);
    expect(familyAfterReuse.headers['set-cookie']).toBeUndefined();
  });

  it('keeps the previous access token valid until it expires', async () => {
    const { accessToken, refreshToken } = await login();
    await app.inject({
      method: 'POST',
      url: '/auth/refresh',
      headers: { cookie: `${REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}` }
    });

    const me = await app.inject({
      method: 'GET',
      url: '/auth/me',
      headers: { cookie: `${ACCESS_TOKEN_COOKIE_NAME}=${accessToken}` }
    });

    expect(me.statusCode).toBe(200);
    expect(JSON.parse(me.body).user).toMatchObject({
      email: adminEmail,
      role: 'ADMIN'
    });
  });
});

describe('POST /auth/logout', () => {
  async function login() {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/admin/login',
      payload: { email: adminEmail, password }
    });
    const cookies = setCookieHeaders(response);

    return {
      accessToken: cookieValue(cookies, ACCESS_TOKEN_COOKIE_NAME) ?? '',
      refreshToken: cookieValue(cookies, REFRESH_TOKEN_COOKIE_NAME) ?? ''
    };
  }

  async function adminId() {
    const [adminUser] = await database
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, adminEmail));
    return adminUser.id;
  }

  it('revokes the current refresh token and clears JWT cookies', async () => {
    const { accessToken, refreshToken } = await login();
    const response = await app.inject({
      method: 'POST',
      url: '/auth/logout',
      headers: {
        cookie: `${ACCESS_TOKEN_COOKIE_NAME}=${accessToken}; ${REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}`
      }
    });
    const cookies = setCookieHeaders(response);
    const stored = await database
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, hashOpaqueToken(refreshToken)));

    expect(response.statusCode).toBe(204);
    expect(response.body).toBe('');
    expect(cookieLine(cookies, ACCESS_TOKEN_COOKIE_NAME)).toContain('Expires=Thu, 01 Jan 1970');
    expect(cookieLine(cookies, REFRESH_TOKEN_COOKIE_NAME)).toContain('Expires=Thu, 01 Jan 1970');
    expect(cookies.join('\n')).not.toMatch(/btm_access=eyJ/);
    expect(stored).toHaveLength(1);
    expect(stored[0].revokedAt).not.toBeNull();
  });

  it('rejects the revoked refresh token after logout', async () => {
    const { refreshToken } = await login();
    await app.inject({
      method: 'POST',
      url: '/auth/logout',
      headers: { cookie: `${REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}` }
    });

    const refresh = await app.inject({
      method: 'POST',
      url: '/auth/refresh',
      headers: { cookie: `${REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}` }
    });

    expect(refresh.statusCode).toBe(401);
  });

  it('succeeds without a refresh cookie and still clears JWT cookies', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/logout'
    });
    const cookies = setCookieHeaders(response);

    expect(response.statusCode).toBe(204);
    expect(cookieLine(cookies, ACCESS_TOKEN_COOKIE_NAME)).toContain('Expires=Thu, 01 Jan 1970');
    expect(cookieLine(cookies, REFRESH_TOKEN_COOKIE_NAME)).toContain('Expires=Thu, 01 Jan 1970');
  });

  it('succeeds when the refresh token does not exist', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/logout',
      headers: { cookie: `${REFRESH_TOKEN_COOKIE_NAME}=${opaqueRefreshTokenGenerator.generate()}` }
    });

    expect(response.statusCode).toBe(204);
  });

  it('succeeds when the refresh token is already revoked', async () => {
    const token = opaqueRefreshTokenGenerator.generate();
    await database.insert(refreshTokens).values({
      id: randomUUID(),
      userId: await adminId(),
      tokenHash: hashOpaqueToken(token),
      familyId: randomUUID(),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
      revokedAt: new Date()
    });

    const response = await app.inject({
      method: 'POST',
      url: '/auth/logout',
      headers: { cookie: `${REFRESH_TOKEN_COOKIE_NAME}=${token}` }
    });

    expect(response.statusCode).toBe(204);
  });

  it('succeeds when the refresh token is expired', async () => {
    const token = opaqueRefreshTokenGenerator.generate();
    await database.insert(refreshTokens).values({
      id: randomUUID(),
      userId: await adminId(),
      tokenHash: hashOpaqueToken(token),
      familyId: randomUUID(),
      expiresAt: new Date(Date.now() - 1000)
    });

    const response = await app.inject({
      method: 'POST',
      url: '/auth/logout',
      headers: { cookie: `${REFRESH_TOKEN_COOKIE_NAME}=${token}` }
    });
    const [stored] = await database
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, hashOpaqueToken(token)));

    expect(response.statusCode).toBe(204);
    expect(stored.revokedAt).not.toBeNull();
  });

  it('does not revoke an already issued access token immediately', async () => {
    const { accessToken, refreshToken } = await login();
    await app.inject({
      method: 'POST',
      url: '/auth/logout',
      headers: { cookie: `${REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}` }
    });

    const me = await app.inject({
      method: 'GET',
      url: '/auth/me',
      headers: { cookie: `${ACCESS_TOKEN_COOKIE_NAME}=${accessToken}` }
    });

    expect(me.statusCode).toBe(200);
    expect(JSON.parse(me.body).user.email).toBe(adminEmail);
  });
});
