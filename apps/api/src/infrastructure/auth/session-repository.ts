import type { PrismaClient } from '@prisma/client';
import type {
  AuthenticatedSession,
  SessionRepository,
  UserCredentials,
  UserRepository
} from '../../modules/auth/application/ports.js';

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly database: PrismaClient) {}

  findByEmail(email: string): Promise<UserCredentials | null> {
    return this.database.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
        isActive: true
      }
    });
  }
}

export class PrismaSessionRepository implements SessionRepository {
  constructor(private readonly database: PrismaClient) {}

  async create(input: AuthenticatedSession): Promise<void> {
    await this.database.session.create({
      data: {
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
        userId: input.user.id
      }
    });
  }

  async findByTokenHash(tokenHash: string): Promise<AuthenticatedSession | null> {
    const session = await this.database.session.findUnique({
      where: { tokenHash },
      include: {
        user: {
          select: { id: true, email: true, role: true }
        }
      }
    });

    if (!session) {
      return null;
    }

    return {
      tokenHash: session.tokenHash,
      expiresAt: session.expiresAt,
      user: session.user
    };
  }
}