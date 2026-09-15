import { SignJWT } from 'jose';
import { describe, expect, it } from 'vitest';
import {
  ACCESS_TOKEN_TTL_SECONDS,
  InvalidAccessTokenError,
  MissingJwtSecretError,
  WeakJwtSecretError,
  createJwtAccessTokenService,
  createJwtAccessTokenServiceFromEnv
} from './jwt-access-token.js';

const secret = 'development-jwt-secret-key-32-chars';
const otherSecret = 'another-jwt-secret-key-32-chars!!';
const claims = {
  sub: 'admin-id',
  email: 'admin@example.com',
  role: 'ADMIN' as const
};

describe('jwt access token infrastructure', () => {
  const tokens = createJwtAccessTokenService({ secret });

  it('issues a verifiable JWT', async () => {
    const token = await tokens.issue(claims);

    expect(token.split('.')).toHaveLength(3);
    await expect(tokens.verify(token)).resolves.toEqual(claims);
  });

  it('exposes the subject as sub', async () => {
    const token = await tokens.issue(claims);
    const verified = await tokens.verify(token);

    expect(verified.sub).toBe(claims.sub);
  });

  it('exposes the role claim', async () => {
    const token = await tokens.issue(claims);
    const verified = await tokens.verify(token);

    expect(verified.role).toBe('ADMIN');
  });

  it('rejects an expired token', async () => {
    const issuedAt = new Date('2026-01-01T00:00:00.000Z');
    const token = await tokens.issue(claims, issuedAt);
    const afterTtl = new Date(issuedAt.getTime() + (ACCESS_TOKEN_TTL_SECONDS + 1) * 1000);

    await expect(tokens.verify(token, afterTtl)).rejects.toBeInstanceOf(InvalidAccessTokenError);
  });

  it('rejects a token signed with another secret', async () => {
    const token = await createJwtAccessTokenService({ secret: otherSecret }).issue(claims);

    await expect(tokens.verify(token)).rejects.toBeInstanceOf(InvalidAccessTokenError);
  });

  it('rejects a malformed token', async () => {
    await expect(tokens.verify('not-a-jwt')).rejects.toBeInstanceOf(InvalidAccessTokenError);
  });

  it('rejects a token that uses a different algorithm', async () => {
    const token = await new SignJWT({ email: claims.email, role: claims.role })
      .setProtectedHeader({ alg: 'HS384', typ: 'JWT' })
      .setSubject(claims.sub)
      .setIssuedAt()
      .setExpirationTime('10m')
      .sign(new TextEncoder().encode(secret));

    await expect(tokens.verify(token)).rejects.toBeInstanceOf(InvalidAccessTokenError);
  });

  it('reads the signing secret only from the environment', () => {
    expect(() => createJwtAccessTokenServiceFromEnv({})).toThrow(MissingJwtSecretError);
    expect(() => createJwtAccessTokenServiceFromEnv({ JWT_SECRET: 'too-short' })).toThrow(WeakJwtSecretError);
    expect(() => createJwtAccessTokenServiceFromEnv({ JWT_SECRET: secret })).not.toThrow();
  });
});
