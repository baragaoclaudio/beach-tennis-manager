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
  familyId: string;
  user: AuthUser;
};

export interface UserRepository {
  findByEmail(email: string): Promise<UserCredentials | null>;
  findById(id: string): Promise<UserCredentials | null>;
}

export interface SessionRepository {
  create(input: AuthenticatedSession): Promise<void>;
  findByTokenHash(tokenHash: string): Promise<AuthenticatedSession | null>;
  deleteByTokenHash(tokenHash: string): Promise<void>;
}

export interface PasswordVerifier {
  verify(hash: string, password: string): Promise<boolean>;
}

export type AccessTokenClaims = {
  sub: string;
  email: string;
  role: Role;
};

export interface AccessTokenService {
  issue(claims: AccessTokenClaims, now?: Date): Promise<string>;
  verify(token: string, now?: Date): Promise<AccessTokenClaims>;
}

export type StoredRefreshToken = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  familyId: string;
  replacedById: string | null;
  revokedAt: Date | null;
};

export type NewRefreshTokenRecord = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  familyId: string;
};

export interface OpaqueTokenGenerator {
  generate(): string;
}

export interface RefreshTokenStore {
  findByTokenHash(tokenHash: string): Promise<StoredRefreshToken | null>;
  findByTokenHashForUpdate(tokenHash: string): Promise<StoredRefreshToken | null>;
  insert(record: NewRefreshTokenRecord): Promise<void>;
  markReplaced(id: string, replacedById: string): Promise<boolean>;
  revokeFamily(familyId: string, revokedAt: Date): Promise<void>;
  revokeByTokenHash(tokenHash: string, revokedAt: Date): Promise<void>;
  listFamily(familyId: string): Promise<StoredRefreshToken[]>;
}

export interface RefreshTokenRepository extends RefreshTokenStore {
  runInTransaction<T>(work: (store: RefreshTokenStore) => Promise<T>): Promise<T>;
}