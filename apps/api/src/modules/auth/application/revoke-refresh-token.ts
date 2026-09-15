import { hashOpaqueToken } from './opaque-token-digest.js';
import type { RefreshTokenRepository } from './ports.js';

export async function revokePresentedRefreshToken(
  presentedToken: string,
  refreshTokens: RefreshTokenRepository,
  now = new Date()
): Promise<void> {
  await refreshTokens.revokeByTokenHash(hashOpaqueToken(presentedToken), now);
}
