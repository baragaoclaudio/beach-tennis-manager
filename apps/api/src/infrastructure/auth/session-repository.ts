import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type {
  AuthenticatedSession,
  SessionRepository,
  UserCredentials,
  UserRepository
} from '../../modules/auth/application/ports.js';
import { refreshTokens, users } from '../database/schema.js';
import type * as databaseSchema from '../database/schema.js';

type Database = NodePgDatabase<typeof databaseSchema>;

export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly database: Database) {}

  async findByEmail(email: string): Promise<UserCredentials | null> {
    const result = await this.database
      .select({
        id: users.id,
        email: users.email,
        passwordHash: users.passwordHash,
        role: users.role,
        isActive: users.isActive
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result[0] ?? null;
  }

  async findById(id: string): Promise<UserCredentials | null> {
    const result = await this.database
      .select({
        id: users.id,
        email: users.email,
        passwordHash: users.passwordHash,
        role: users.role,
        isActive: users.isActive
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return result[0] ?? null;
  }
}

export class DrizzleSessionRepository implements SessionRepository {
  constructor(private readonly database: Database) {}

  async create(input: AuthenticatedSession): Promise<void> {
    const id = randomUUID();

    await this.database.insert(refreshTokens).values({
      id,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
      userId: input.user.id,
      familyId: input.familyId
    });
  }

  async findByTokenHash(tokenHash: string): Promise<AuthenticatedSession | null> {
    const result = await this.database
      .select({
        tokenHash: refreshTokens.tokenHash,
        expiresAt: refreshTokens.expiresAt,
        familyId: refreshTokens.familyId,
        id: users.id,
        email: users.email,
        role: users.role
      })
      .from(refreshTokens)
      .innerJoin(users, eq(refreshTokens.userId, users.id))
      .where(eq(refreshTokens.tokenHash, tokenHash))
      .limit(1);
    const session = result[0];

    if (!session) {
      return null;
    }

    return {
      tokenHash: session.tokenHash,
      expiresAt: session.expiresAt,
      familyId: session.familyId,
      user: {
        id: session.id,
        email: session.email,
        role: session.role
      }
    };
  }

  async deleteByTokenHash(tokenHash: string): Promise<void> {
    await this.database.delete(refreshTokens).where(eq(refreshTokens.tokenHash, tokenHash));
  }
}