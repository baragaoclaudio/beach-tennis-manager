import { SignJWT, jwtVerify, errors as joseErrors } from 'jose';
import type { AccessTokenClaims, AccessTokenService, Role } from '../../modules/auth/application/ports.js';

export const ACCESS_TOKEN_TTL_SECONDS = 10 * 60;
export const ACCESS_TOKEN_ALGORITHM = 'HS256';
export const JWT_SECRET_ENV = 'JWT_SECRET';
const MIN_SECRET_LENGTH = 32;

const roles: readonly Role[] = ['ADMIN', 'PROFESSOR'];

export class InvalidAccessTokenError extends Error {
  constructor() {
    super('Invalid access token');
    this.name = 'InvalidAccessTokenError';
  }
}

export class MissingJwtSecretError extends Error {
  constructor() {
    super(`${JWT_SECRET_ENV} is required`);
    this.name = 'MissingJwtSecretError';
  }
}

export class WeakJwtSecretError extends Error {
  constructor() {
    super(`${JWT_SECRET_ENV} must be at least ${MIN_SECRET_LENGTH} characters`);
    this.name = 'WeakJwtSecretError';
  }
}

export type JwtAccessTokenOptions = {
  secret: string;
};

function encodeSecret(secret: string): Uint8Array {
  if (secret.length < MIN_SECRET_LENGTH) {
    throw new WeakJwtSecretError();
  }

  return new TextEncoder().encode(secret);
}

function isRole(value: unknown): value is Role {
  return typeof value === 'string' && roles.includes(value as Role);
}

function readClaims(payload: {
  sub?: string;
  email?: unknown;
  role?: unknown;
}): AccessTokenClaims {
  if (
    typeof payload.sub !== 'string' ||
    payload.sub.length === 0 ||
    typeof payload.email !== 'string' ||
    payload.email.length === 0 ||
    !isRole(payload.role)
  ) {
    throw new InvalidAccessTokenError();
  }

  return {
    sub: payload.sub,
    email: payload.email,
    role: payload.role
  };
}

export function createJwtAccessTokenService(
  options: JwtAccessTokenOptions
): AccessTokenService {
  const secretKey = encodeSecret(options.secret);

  return {
    async issue(claims, now = new Date()) {
      const expiresAt = new Date(now.getTime() + ACCESS_TOKEN_TTL_SECONDS * 1000);

      return new SignJWT({
        email: claims.email,
        role: claims.role
      })
        .setProtectedHeader({ alg: ACCESS_TOKEN_ALGORITHM, typ: 'JWT' })
        .setSubject(claims.sub)
        .setIssuedAt(now)
        .setExpirationTime(expiresAt)
        .sign(secretKey);
    },

    async verify(token, now = new Date()) {
      try {
        const { payload } = await jwtVerify(token, secretKey, {
          algorithms: [ACCESS_TOKEN_ALGORITHM],
          currentDate: now
        });

        return readClaims(payload);
      } catch (error) {
        if (error instanceof InvalidAccessTokenError) {
          throw error;
        }

        if (
          error instanceof joseErrors.JOSEError ||
          error instanceof SyntaxError ||
          error instanceof TypeError
        ) {
          throw new InvalidAccessTokenError();
        }

        throw error;
      }
    }
  };
}

export function createJwtAccessTokenServiceFromEnv(
  env: NodeJS.ProcessEnv = process.env
): AccessTokenService {
  const secret = env[JWT_SECRET_ENV];

  if (!secret) {
    throw new MissingJwtSecretError();
  }

  return createJwtAccessTokenService({ secret });
}
