import { randomBytes, randomUUID } from 'node:crypto';
import type {
  AccessTokenService,
  AuthUser,
  PasswordVerifier,
  SessionRepository,
  UserRepository
} from './ports.js';
import { hashOpaqueToken } from './opaque-token-digest.js';

export const ADMIN_SESSION_TTL_SECONDS = 8 * 60 * 60;
export const REFRESH_TOKEN_TTL_SECONDS = ADMIN_SESSION_TTL_SECONDS;

export class InvalidAdminCredentialsError extends Error {
  constructor() {
    super('Invalid administrator credentials');
    this.name = 'InvalidAdminCredentialsError';
  }
}

export type LoginAdminDependencies = {
  users: UserRepository;
  sessions: SessionRepository;
  passwords: PasswordVerifier;
  accessTokens: AccessTokenService;
  now?: () => Date;
};

export type LoginAdminResult = {
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
  user: AuthUser;
};

export async function loginAdmin(
  email: string,
  password: string,
  dependencies: LoginAdminDependencies
): Promise<LoginAdminResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await dependencies.users.findByEmail(normalizedEmail);

  if (
    !user ||
    user.role !== 'ADMIN' ||
    !user.isActive ||
    !(await dependencies.passwords.verify(user.passwordHash, password))
  ) {
    throw new InvalidAdminCredentialsError();
  }

  const now = dependencies.now ?? (() => new Date());
  const issuedAt = now();
  const authUser = {
    id: user.id,
    email: user.email,
    role: user.role
  };
  const accessToken = await dependencies.accessTokens.issue({
    sub: user.id,
    email: user.email,
    role: user.role
  }, issuedAt);
  const refreshToken = randomBytes(32).toString('hex');
  const tokenHash = hashSessionToken(refreshToken);
  const refreshExpiresAt = new Date(issuedAt.getTime() + REFRESH_TOKEN_TTL_SECONDS * 1000);

  await dependencies.sessions.create({
    tokenHash,
    expiresAt: refreshExpiresAt,
    familyId: randomUUID(),
    user: authUser
  });

  return {
    accessToken,
    refreshToken,
    refreshExpiresAt,
    user: authUser
  };
}

export function hashSessionToken(token: string): string {
  return hashOpaqueToken(token);
}
