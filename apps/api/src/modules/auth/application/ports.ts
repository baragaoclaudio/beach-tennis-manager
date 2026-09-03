export type Role = 'ADMIN' | 'PROFESSOR';

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
};

export type UserCredentials = AuthUser & {
  passwordHash: string;
  isActive: boolean;
};

export type AuthenticatedSession = {
  tokenHash: string;
  expiresAt: Date;
  user: AuthUser;
};

export interface UserRepository {
  findByEmail(email: string): Promise<UserCredentials | null>;
}

export interface SessionRepository {
  create(input: AuthenticatedSession): Promise<void>;
  findByTokenHash(tokenHash: string): Promise<AuthenticatedSession | null>;
}

export interface PasswordVerifier {
  verify(hash: string, password: string): Promise<boolean>;
}