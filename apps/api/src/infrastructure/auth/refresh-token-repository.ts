import { and, eq, isNull } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type {
  NewRefreshTokenRecord,
  RefreshTokenRepository,
  RefreshTokenStore,
  StoredRefreshToken
} from '../../modules/auth/application/ports.js';
import { refreshTokens } from '../database/schema.js';
import type * as databaseSchema from '../database/schema.js';

type Database = NodePgDatabase<typeof databaseSchema>;

function toStored(row: {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  familyId: string;
  replacedById: string | null;
  revokedAt: Date | null;
}): StoredRefreshToken {
  return row;
}

class DrizzleRefreshTokenStore implements RefreshTokenStore {
  constructor(private readonly database: Database) {}

  async findByTokenHash(tokenHash: string): Promise<StoredRefreshToken | null> {
    const result = await this.database
      .select({
        id: refreshTokens.id,
        userId: refreshTokens.userId,
        tokenHash: refreshTokens.tokenHash,
        expiresAt: refreshTokens.expiresAt,
        familyId: refreshTokens.familyId,
        replacedById: refreshTokens.replacedById,
        revokedAt: refreshTokens.revokedAt
      })
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, tokenHash))
      .limit(1);

    return result[0] ? toStored(result[0]) : null;
  }

  async findByTokenHashForUpdate(tokenHash: string): Promise<StoredRefreshToken | null> {
    const result = await this.database
      .select({
        id: refreshTokens.id,
        userId: refreshTokens.userId,
        tokenHash: refreshTokens.tokenHash,
        expiresAt: refreshTokens.expiresAt,
        familyId: refreshTokens.familyId,
        replacedById: refreshTokens.replacedById,
        revokedAt: refreshTokens.revokedAt
      })
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, tokenHash))
      .limit(1)
      .for('update');

    return result[0] ? toStored(result[0]) : null;
  }

  async insert(record: NewRefreshTokenRecord): Promise<void> {
    await this.database.insert(refreshTokens).values({
      id: record.id,
      userId: record.userId,
      tokenHash: record.tokenHash,
      expiresAt: record.expiresAt,
      familyId: record.familyId
    });
  }

  async markReplaced(id: string, replacedById: string): Promise<boolean> {
    const updated = await this.database
      .update(refreshTokens)
      .set({ replacedById })
      .where(and(
        eq(refreshTokens.id, id),
        isNull(refreshTokens.replacedById),
        isNull(refreshTokens.revokedAt)
      ))
      .returning({ id: refreshTokens.id });

    return updated.length === 1;
  }

  async revokeFamily(familyId: string, revokedAt: Date): Promise<void> {
    await this.database
      .update(refreshTokens)
      .set({ revokedAt })
      .where(and(eq(refreshTokens.familyId, familyId), isNull(refreshTokens.revokedAt)));
  }

  async revokeByTokenHash(tokenHash: string, revokedAt: Date): Promise<void> {
    await this.database
      .update(refreshTokens)
      .set({ revokedAt })
      .where(and(eq(refreshTokens.tokenHash, tokenHash), isNull(refreshTokens.revokedAt)));
  }

  async listFamily(familyId: string): Promise<StoredRefreshToken[]> {
    const rows = await this.database
      .select({
        id: refreshTokens.id,
        userId: refreshTokens.userId,
        tokenHash: refreshTokens.tokenHash,
        expiresAt: refreshTokens.expiresAt,
        familyId: refreshTokens.familyId,
        replacedById: refreshTokens.replacedById,
        revokedAt: refreshTokens.revokedAt
      })
      .from(refreshTokens)
      .where(eq(refreshTokens.familyId, familyId));

    return rows.map(toStored);
  }
}

export class DrizzleRefreshTokenRepository
  extends DrizzleRefreshTokenStore
  implements RefreshTokenRepository
{
  constructor(private readonly db: Database) {
    super(db);
  }

  runInTransaction<T>(work: (store: RefreshTokenStore) => Promise<T>): Promise<T> {
    return this.db.transaction(async (tx) => {
      return work(new DrizzleRefreshTokenStore(tx as Database));
    });
  }
}
