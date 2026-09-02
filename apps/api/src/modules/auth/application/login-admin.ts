import { randomBytes, createHash } from 'node:crypto';
import type {
  AuthUser,
  PasswordVerifier,
  SessionRepository,
  UserRepository
} from './ports.js';

export const ADMIN_SESSION_TTL_SECONDS = 8 * 60 * 60;

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
  now?: () => Date;
};

export type LoginAdminResult = {
  token: string;
  expiresAt: Date;
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

  const token = randomBytes(32).toString('hex');
  const tokenHash = hashSessionToken(token);
  const now = dependencies.now ?? (() => new Date());
  const expiresAt = new Date(now().getTime() + ADMIN_SESSION_TTL_SECONDS * 1000);

  await dependencies.sessions.create({
    tokenHash,
    expiresAt,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  });

  return {
    token,
    expiresAt,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  };
}

export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}