import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type {
  AuthenticatedSession,
  SessionRepository,
  UserCredentials,
  UserRepository
} from '../../modules/auth/application/ports.js';
import { sessions, users } from '../database/schema.js';
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
}

export class DrizzleSessionRepository implements SessionRepository {
  constructor(private readonly database: Database) {}

  async create(input: AuthenticatedSession): Promise<void> {
    await this.database.insert(sessions).values({
      id: randomUUID(),
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
      userId: input.user.id
    });
  }

  async findByTokenHash(tokenHash: string): Promise<AuthenticatedSession | null> {
    const result = await this.database
      .select({
        tokenHash: sessions.tokenHash,
        expiresAt: sessions.expiresAt,
        id: users.id,
        email: users.email,
        role: users.role
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.tokenHash, tokenHash))
      .limit(1);
    const session = result[0];

    if (!session) {
      return null;
    }

    return {
      tokenHash: session.tokenHash,
      expiresAt: session.expiresAt,
      user: {
        id: session.id,
        email: session.email,
        role: session.role
      }
    };
  }

  async deleteByTokenHash(tokenHash: string): Promise<void> {
    await this.database.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
  }
}