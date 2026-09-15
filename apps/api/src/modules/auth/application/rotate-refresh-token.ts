import { randomUUID } from 'node:crypto';
import { REFRESH_TOKEN_TTL_SECONDS } from './login-admin.js';
import { hashOpaqueToken } from './opaque-token-digest.js';
import type {
  AuthUser,
  OpaqueTokenGenerator,
  RefreshTokenRepository,
  StoredRefreshToken,
  UserRepository
} from './ports.js';

export class RefreshTokenNotFoundError extends Error {
  constructor() {
    super('Refresh token not found');
    this.name = 'RefreshTokenNotFoundError';
  }
}

export class RefreshTokenExpiredError extends Error {
  constructor() {
    super('Refresh token expired');
    this.name = 'RefreshTokenExpiredError';
  }
}

export class RefreshTokenRevokedError extends Error {
  constructor() {
    super('Refresh token revoked');
    this.name = 'RefreshTokenRevokedError';
  }
}

export class RefreshTokenReuseDetectedError extends Error {
  constructor() {
    super('Refresh token reuse detected');
    this.name = 'RefreshTokenReuseDetectedError';
  }
}

export type RotateRefreshTokenDependencies = {
  refreshTokens: RefreshTokenRepository;
  users: UserRepository;
  tokens: OpaqueTokenGenerator;
  now?: () => Date;
};

export type RotateRefreshTokenResult = {
  refreshToken: string;
  refreshExpiresAt: Date;
  user: AuthUser;
};

export async function rotateRefreshToken(
  presentedToken: string,
  dependencies: RotateRefreshTokenDependencies
): Promise<RotateRefreshTokenResult> {
  const presentedHash = hashOpaqueToken(presentedToken);
  const now = dependencies.now ?? (() => new Date());
  const at = now();

  const outcome = await dependencies.refreshTokens.runInTransaction(async (store) => {
    const current = await store.findByTokenHashForUpdate(presentedHash);

    if (!current) {
      throw new RefreshTokenNotFoundError();
    }

    if (current.expiresAt <= at) {
      throw new RefreshTokenExpiredError();
    }

    if (current.revokedAt) {
      throw new RefreshTokenRevokedError();
    }

    if (current.replacedById) {
      await store.revokeFamily(current.familyId, at);
      return { status: 'reuse' as const };
    }

    const user = await loadCurrentUser(current, dependencies.users);
    const nextId = randomUUID();
    const refreshToken = dependencies.tokens.generate();
    const refreshExpiresAt = new Date(at.getTime() + REFRESH_TOKEN_TTL_SECONDS * 1000);

    await store.insert({
      id: nextId,
      userId: current.userId,
      tokenHash: hashOpaqueToken(refreshToken),
      expiresAt: refreshExpiresAt,
      familyId: current.familyId
    });

    const replaced = await store.markReplaced(current.id, nextId);

    if (!replaced) {
      await store.revokeFamily(current.familyId, at);
      return { status: 'reuse' as const };
    }

    return {
      status: 'rotated' as const,
      refreshToken,
      refreshExpiresAt,
      user
    };
  });

  if (outcome.status === 'reuse') {
    throw new RefreshTokenReuseDetectedError();
  }

  return {
    refreshToken: outcome.refreshToken,
    refreshExpiresAt: outcome.refreshExpiresAt,
    user: outcome.user
  };
}

async function loadCurrentUser(
  current: StoredRefreshToken,
  users: UserRepository
): Promise<AuthUser> {
  const user = await users.findById(current.userId);

  if (!user || !user.isActive) {
    throw new RefreshTokenRevokedError();
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role
  };
}
