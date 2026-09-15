import { hashSessionToken } from './login-admin.js';
import type {
  AccessTokenService,
  AuthUser,
  SessionRepository,
  UserRepository
} from './ports.js';

export async function getAuthenticatedUser(
  accessToken: string,
  accessTokens: AccessTokenService,
  users: UserRepository
): Promise<AuthUser | null> {
  try {
    const claims = await accessTokens.verify(accessToken);
    const user = await users.findById(claims.sub);

    if (!user || !user.isActive) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'InvalidAccessTokenError') {
      return null;
    }

    throw error;
  }
}

export async function getAuthenticatedUserFromSession(
  token: string,
  sessions: SessionRepository,
  now = new Date()
): Promise<AuthUser | null> {
  const session = await sessions.findByTokenHash(hashSessionToken(token));

  if (!session || session.expiresAt <= now) {
    return null;
  }

  return session.user;
}
