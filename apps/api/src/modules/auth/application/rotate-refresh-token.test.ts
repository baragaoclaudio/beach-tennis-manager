import argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { opaqueRefreshTokenGenerator } from '../../../infrastructure/auth/opaque-refresh-token.js';
import { DrizzleRefreshTokenRepository } from '../../../infrastructure/auth/refresh-token-repository.js';
import { DrizzleUserRepository } from '../../../infrastructure/auth/session-repository.js';
import { database } from '../../../infrastructure/database/connection.js';
import { refreshTokens, users } from '../../../infrastructure/database/schema.js';
import { hashOpaqueToken } from './opaque-token-digest.js';
import { REFRESH_TOKEN_TTL_SECONDS } from './login-admin.js';
import {
  RefreshTokenExpiredError,
  RefreshTokenNotFoundError,
  RefreshTokenReuseDetectedError,
  RefreshTokenRevokedError,
  rotateRefreshToken
} from './rotate-refresh-token.js';

const email = `refresh-rotate-${Date.now()}@example.com`;
const password = 'admin-password';
const refreshTokensRepo = new DrizzleRefreshTokenRepository(database);
const usersRepo = new DrizzleUserRepository(database);
const tokens = opaqueRefreshTokenGenerator;
let userId = '';

async function persistRefresh(input: {
  token?: string;
  familyId?: string;
  expiresAt?: Date;
  replacedById?: string | null;
  revokedAt?: Date | null;
  id?: string;
}) {
  const id = input.id ?? randomUUID();
  const token = input.token ?? tokens.generate();
  await database.insert(refreshTokens).values({
    id,
    userId,
    tokenHash: hashOpaqueToken(token),
    familyId: input.familyId ?? randomUUID(),
    expiresAt: input.expiresAt ?? new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
    replacedById: input.replacedById ?? null,
    revokedAt: input.revokedAt ?? null
  });
  return { id, token };
}

beforeAll(async () => {
  userId = randomUUID();
  await database.insert(users).values({
    id: userId,
    email,
    passwordHash: await argon2.hash(password),
    role: 'ADMIN',
    updatedAt: new Date()
  });
});

afterAll(async () => {
  await database.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
  await database.delete(users).where(eq(users.id, userId));
});

describe('refresh token rotation', () => {
  it('finds a valid token by hash', async () => {
    const { token } = await persistRefresh({});
    const stored = await refreshTokensRepo.findByTokenHash(hashOpaqueToken(token));

    expect(stored).not.toBeNull();
    expect(stored?.tokenHash).toBe(hashOpaqueToken(token));
    expect(stored?.tokenHash).not.toBe(token);
  });

  it('rejects an expired token without treating it as reuse', async () => {
    const familyId = randomUUID();
    const { token, id } = await persistRefresh({
      familyId,
      expiresAt: new Date(Date.now() - 1000)
    });

    await expect(rotateRefreshToken(token, {
      refreshTokens: refreshTokensRepo,
      users: usersRepo,
      tokens
    })).rejects.toBeInstanceOf(RefreshTokenExpiredError);

    const family = await refreshTokensRepo.listFamily(familyId);
    expect(family).toHaveLength(1);
    expect(family[0].id).toBe(id);
    expect(family[0].replacedById).toBeNull();
    expect(family[0].revokedAt).toBeNull();
  });

  it('rejects a revoked token without rotating', async () => {
    const { token } = await persistRefresh({
      revokedAt: new Date()
    });

    await expect(rotateRefreshToken(token, {
      refreshTokens: refreshTokensRepo,
      users: usersRepo,
      tokens
    })).rejects.toBeInstanceOf(RefreshTokenRevokedError);
  });

  it('rejects a token that does not exist', async () => {
    await expect(rotateRefreshToken(tokens.generate(), {
      refreshTokens: refreshTokensRepo,
      users: usersRepo,
      tokens
    })).rejects.toBeInstanceOf(RefreshTokenNotFoundError);
  });

  it('rotates a valid token atomically onto the same family', async () => {
    const familyId = randomUUID();
    const { token: currentToken, id: currentId } = await persistRefresh({ familyId });

    const result = await rotateRefreshToken(currentToken, {
      refreshTokens: refreshTokensRepo,
      users: usersRepo,
      tokens
    });

    expect(result.refreshToken).not.toBe(currentToken);
    expect(result.user.id).toBe(userId);
    expect(result).not.toHaveProperty('accessToken');

    const family = await refreshTokensRepo.listFamily(familyId);
    const previous = family.find((row) => row.id === currentId);
    const next = family.find((row) => row.id !== currentId);

    expect(family).toHaveLength(2);
    expect(next).toBeDefined();
    expect(next?.familyId).toBe(familyId);
    expect(next?.tokenHash).toBe(hashOpaqueToken(result.refreshToken));
    expect(next?.tokenHash).not.toBe(result.refreshToken);
    expect(previous?.replacedById).toBe(next?.id);
    expect(previous?.revokedAt).toBeNull();
    expect(next?.replacedById).toBeNull();
    expect(next?.revokedAt).toBeNull();
    expect(
      Math.abs(result.refreshExpiresAt.getTime() - (Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000))
    ).toBeLessThan(10_000);
  });

  it('detects reuse of a replaced token, revokes the family and does not issue a new token', async () => {
    const familyId = randomUUID();
    const { token: firstToken } = await persistRefresh({ familyId });
    const rotated = await rotateRefreshToken(firstToken, {
      refreshTokens: refreshTokensRepo,
      users: usersRepo,
      tokens
    });

    await expect(rotateRefreshToken(firstToken, {
      refreshTokens: refreshTokensRepo,
      users: usersRepo,
      tokens
    })).rejects.toBeInstanceOf(RefreshTokenReuseDetectedError);

    const family = await refreshTokensRepo.listFamily(familyId);
    expect(family).toHaveLength(2);
    expect(family.every((row) => row.revokedAt !== null)).toBe(true);
    expect(family.some((row) => row.tokenHash === hashOpaqueToken(rotated.refreshToken))).toBe(true);
    expect(family.some((row) => row.tokenHash === hashOpaqueToken(firstToken))).toBe(true);
    expect(family.every((row) => row.tokenHash !== firstToken)).toBe(true);
  });

  it('does not rotate the same token twice under concurrent requests', async () => {
    const familyId = randomUUID();
    const { token } = await persistRefresh({ familyId });

    const outcomes = await Promise.allSettled([
      rotateRefreshToken(token, { refreshTokens: refreshTokensRepo, users: usersRepo, tokens }),
      rotateRefreshToken(token, { refreshTokens: refreshTokensRepo, users: usersRepo, tokens })
    ]);

    const fulfilled = outcomes.filter((outcome) => outcome.status === 'fulfilled');
    const rejected = outcomes.filter((outcome) => outcome.status === 'rejected');

    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    expect(rejected[0].status === 'rejected' && rejected[0].reason).toBeInstanceOf(RefreshTokenReuseDetectedError);

    const family = await refreshTokensRepo.listFamily(familyId);
    expect(family.filter((row) => row.revokedAt === null)).toHaveLength(0);
  });
});
