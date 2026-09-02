import { hashSessionToken } from './login-admin.js';
import type { AuthUser, SessionRepository } from './ports.js';

export async function getAuthenticatedUser(
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